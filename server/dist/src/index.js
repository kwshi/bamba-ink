"use strict";
exports.__esModule = true;
var Handlers = require("./handlers");
var Wss = require("./wss");
if (!process.env.PORT)
    throw new Error("no PORT specified");
var port = parseInt(process.env.PORT);
if (!port)
    throw new Error("invalid PORT " + JSON.stringify(process.env.PORT));
Wss.setup({ port: port }, Handlers.handlers);
