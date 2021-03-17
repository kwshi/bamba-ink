"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
exports.setup = void 0;
var Ws = require("ws");
var Uid = require("uid");
var Pr = require("path-to-regexp");
var matchPath = Pr.match("/ws/board/:roomId");
var getRoom = function (rooms, roomId) {
    var existing = rooms.get(roomId);
    if (existing)
        return existing;
    var room = new Map();
    rooms.set(roomId, room);
    return room;
};
var setup = function (opts, handlers) {
    var wss = new Ws.Server(opts);
    var rooms = new Map();
    wss.on("connection", function (ws, req) {
        if (!req.url)
            return;
        var match = matchPath(req.url);
        if (!match)
            return;
        var clientId = Uid.uid();
        var room = getRoom(rooms, match.params.roomId);
        room.set(clientId, ws);
        // TODO sanitize roomid
        var session = {
            roomId: match.params.roomId,
            clientId: clientId,
            reply: function (msg) {
                ws.send(JSON.stringify(msg));
            },
            sendAll: function (msg) {
                var e_1, _a;
                var s = JSON.stringify(msg);
                try {
                    for (var _b = __values(room.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var ws_1 = _c.value;
                        ws_1.send(s);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            },
            sendOthers: function (msg) {
                var e_2, _a;
                var s = JSON.stringify(msg);
                try {
                    for (var room_1 = __values(room), room_1_1 = room_1.next(); !room_1_1.done; room_1_1 = room_1.next()) {
                        var _b = __read(room_1_1.value, 2), cid = _b[0], ws_2 = _b[1];
                        if (cid !== clientId)
                            ws_2.send(s);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (room_1_1 && !room_1_1.done && (_a = room_1["return"])) _a.call(room_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        var alive = true;
        var ping = function () {
            if (!alive) {
                room["delete"](clientId);
                ws.terminate();
                return;
            }
            ws.ping();
            setTimeout(ping, 10000);
        };
        ws.on("pong", function () {
            console.log("got pong from " + clientId);
            alive = true;
        });
        setTimeout(ping, 10000);
        ws.on("message", function (raw) {
            // TODO type safety
            var msg = JSON.parse(raw.toString());
            var handler = handlers[msg.type];
            handler(session, msg.data);
        });
    });
};
exports.setup = setup;
