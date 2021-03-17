"use strict";
exports.__esModule = true;
exports.client = void 0;
var Redis = require("redis");
var Config = require("./config");
exports.client = Redis.createClient(Config.REDIS_URL);
