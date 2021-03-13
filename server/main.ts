import * as Ws from "ws";

new Ws.Server({ port: 1234 }).on("connection", (ws) => {
  console.log("got connection");
});
