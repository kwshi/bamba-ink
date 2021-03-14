import type * as Http from "http";
import type * as Net from "net";

import * as Uuid from "uuid";

import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as Sapper from "@sapper/server";
import WebSocket, * as Ws from "ws";

import * as Msg from "@/common/msg";
import * as Board from "@/common/board";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const wss = new Ws.Server({ noServer: true });

const store: {
  board: Board.Page;
  clients: Map<string, WebSocket>;
} = {
  board: new Board.Page(),
  clients: new Map(),
};

const handlers: Record<Msg.ClientType, (uuid: string, raw: unknown) => void> = {
  [Msg.ClientType.WorkStart]: (uuid, raw) => {
    if (!Array.isArray(raw)) return;
    const [x, y] = <unknown[]>raw;
    if (typeof x !== "number" || typeof y !== "number") return;

    for (const [u, ws] of store.clients.entries()) {
      if (u === uuid) continue;
      const msg: Msg.HostMsg = {
        type: Msg.HostType.WorkStart,
        data: { uuid, point: [x, y] },
      };
      ws.send(JSON.stringify(msg));
    }
  },
  [Msg.ClientType.WorkMove]: (uuid, raw) => {
    if (!Array.isArray(raw)) return;
    const [x, y] = <unknown[]>raw;
    if (typeof x !== "number" || typeof y !== "number") return;

    for (const [u, ws] of store.clients.entries()) {
      if (u === uuid) continue;
      const msg: Msg.HostMsg = {
        type: Msg.HostType.WorkMove,
        data: { uuid, point: [x, y] },
      };
      ws.send(JSON.stringify(msg));
    }
  },
  [Msg.ClientType.Commit]: (uuid) => {
    console.log("commit");
    for (const [u, ws] of store.clients.entries()) {
      if (u === uuid) continue;
      const msg: Msg.HostMsg = {
        type: Msg.HostType.Commit,
        data: { uuid },
      };
      ws.send(JSON.stringify(msg));
    }
  },
};

const hasOwnProperty = <T extends {}, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => obj.hasOwnProperty(prop);

const isOwnPropertyOf = <T extends {}>(
  prop: PropertyKey,
  obj: T
): prop is keyof T => obj.hasOwnProperty(prop);

wss.on("connection", (ws) => {
  const uuid = Uuid.v4();
  store.clients.set(uuid, ws);

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString()) as unknown;

    if (
      typeof msg !== "object" ||
      !msg ||
      !hasOwnProperty(msg, "type") ||
      typeof msg.type !== "number" ||
      !isOwnPropertyOf(msg.type, handlers) ||
      !hasOwnProperty(msg, "data")
    )
      return;

    const f = handlers[msg.type];
    f(uuid, msg.data);
  });

  console.log(wss.clients.size);
});

const { server } = polka()
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    Sapper.middleware()
  )
  .listen(PORT, (err: Error) => {
    if (err) console.log("error", err);
  });

server!.on(
  "upgrade",
  (req: Http.IncomingMessage, socket: Net.Socket, head: Buffer) => {
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  }
);
