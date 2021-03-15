import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as Sapper from "@sapper/server";

import * as Handlers from "./handlers";
import * as Wss from "./wss";

const { PORT } = process.env;

const { server } = polka()
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev: process.env.NODE_ENV === "development" }),
    Sapper.middleware()
  )
  .listen(PORT, (err: Error) => {
    if (err) console.log("error", err);
  });

Wss.setup(server!, Handlers.handlers);
