import type * as Http from "http";
import type * as Net from "net";
import type * as Msg from "@/common/msg";

import WebSocket, * as Ws from "ws";
import * as Uid from "uid";
import * as Pr from "path-to-regexp";

interface Session {
  clientId: string;
  sendAll(msg: Msg.HostMsg): void;
  sendOthers(msg: Msg.HostMsg): void;
}

type Handler<T extends Msg.ClientType> = (
  session: Session,
  payload: Msg.ClientData[T]
) => void;

export type Handlers = { [T in Msg.ClientType]: Handler<T> };

const matchPath = Pr.match<{ roomId: string }>("/ws/board/:roomId");

const getRoom = (
  rooms: Map<string, Map<string, WebSocket>>,
  roomId: string
): Map<string, WebSocket> => {
  const existing = rooms.get(roomId);
  if (existing) return existing;
  const room = new Map<string, WebSocket>();
  rooms.set(roomId, room);
  return room;
};

export const setup = (http: Http.Server, handlers: Handlers) => {
  const wss = new Ws.Server({ noServer: true });
  const rooms: Map<string, Map<string, WebSocket>> = new Map();

  http.on(
    "upgrade",
    (req: Http.IncomingMessage, socket: Net.Socket, head: Buffer) =>
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req)
      )
  );

  wss.on("connection", (ws, req) => {
    if (!req.url) return;
    const match = matchPath(req.url);
    if (!match) return;

    const clientId = Uid.uid();
    const { roomId } = match.params;
    const room = getRoom(rooms, roomId);
    room.set(clientId, ws);

    const session: Session = {
      clientId,
      sendAll(msg) {
        const s = JSON.stringify(msg);
        for (const ws of room.values()) ws.send(s);
      },
      sendOthers(msg) {
        const s = JSON.stringify(msg);
        for (const [cid, ws] of room) if (cid !== clientId) ws.send(s);
      },
    };

    ws.on("message", (raw) => {
      // TODO type safety
      const msg = JSON.parse(raw.toString()) as Msg.ClientMsg;
      const handler = handlers[msg.type] as Handler<Msg.ClientType>;
      handler(session, msg.data);
    });
  });
};
