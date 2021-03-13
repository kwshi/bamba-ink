import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import * as Ws from "ws";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err: Error) => {
    if (err) console.log("error", err);
  });

const wss = new Ws.Server({ port: 1234 });

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
