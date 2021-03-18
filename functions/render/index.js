"use strict";

const serverlessHttp = require("serverless-http");
const server = require("./build/server/server");

module.exports.handler = serverlessHttp(server);
