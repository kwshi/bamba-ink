import type * as Http from "http";
import type * as Net from "net";

import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import * as Ws from "ws";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const wss = new Ws.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("got a new connection");
  ws.on("message", (a) => {
    console.log(JSON.parse(a.toString()));

    for (const s of wss.clients) {
      if (s === ws) continue;
      s.send(a);
    }
  });

  console.log(wss.clients.size);
});

const { server } = polka()
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err: Error) => {
    if (err) console.log("error", err);
  });

server?.on(
  "upgrade",
  (req: Http.IncomingMessage, socket: Net.Socket, head: Buffer) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws);
    });
  }
);
