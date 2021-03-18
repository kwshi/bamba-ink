import * as Path from "path";
import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as Sapper from "@sapper/server";

export default polka()
  .use(
    compression({ threshold: 0 }),
    sirv(Path.join(__dirname, "../static"), {
      dev: process.env.NODE_ENV === "development",
    }),
    Sapper.middleware()
  )
  .listen(process.env.PORT, (err: Error) => {
    if (err) console.log("error", err);
  });
