"use strict";
var _a;
exports.__esModule = true;
exports.PORT = exports.REDIS_URL = exports.NODE_ENV = void 0;
var Dotenv = require("dotenv");
process.env.NODE_ENV === "development" &&
    Dotenv.config({
        path: "dev.env"
    });
if (!process.env.REDIS_URL)
    throw new Error("REDIS_URL not defined");
exports.NODE_ENV = (_a = process.env, _a.NODE_ENV), exports.REDIS_URL = _a.REDIS_URL, exports.PORT = _a.PORT;
