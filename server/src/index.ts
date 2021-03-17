import * as Handlers from "./handlers";
import * as Wss from "./wss";

if (!process.env.PORT) throw new Error("no PORT specified");
const port = parseInt(process.env.PORT);
if (!port) throw new Error(`invalid PORT ${JSON.stringify(process.env.PORT)}`);

Wss.setup({ port }, Handlers.handlers);
