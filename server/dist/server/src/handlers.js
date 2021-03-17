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
var _a;
exports.__esModule = true;
exports.handlers = void 0;
var Msg = require("@bamba/common/msg");
var Redis = require("./redis");
exports.handlers = (_a = {},
    _a[Msg.ClientType.Join] = function (session) {
        Redis.client.lrange("commit:" + session.roomId + ":stroke:ids", 0, -1, function (err, ids) {
            var e_1, _a;
            var _loop_1 = function (id) {
                Redis.client.lrange("commit:" + session.roomId + ":strokes:" + id + ":x", 0, -1, function (_, xs) {
                    Redis.client.lrange("commit:" + session.roomId + ":strokes:" + id + ":y", 0, -1, function (_, ys) {
                        var pts = xs.map(function (x, i) { return [
                            Number(x),
                            Number(ys[i]),
                        ]; });
                        session.reply({ type: Msg.HostType.Init, data: [pts] });
                        //console.log(pts);
                    });
                });
            };
            try {
                for (var ids_1 = __values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
                    var id = ids_1_1.value;
                    _loop_1(id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ids_1_1 && !ids_1_1.done && (_a = ids_1["return"])) _a.call(ids_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
    _a[Msg.ClientType.WorkStart] = function (session, data) {
        if (!Array.isArray(data))
            return;
        var _a = __read(data, 2), x = _a[0], y = _a[1];
        if (typeof x !== "number" || typeof y !== "number")
            return;
        session.sendOthers({
            type: Msg.HostType.WorkStart,
            data: { uuid: session.clientId, point: [x, y] }
        });
        Redis.client
            .multi()
            .rpush("work:" + session.roomId + ":" + session.clientId + ":x", x.toString())
            .rpush("work:" + session.roomId + ":" + session.clientId + ":y", y.toString())
            .exec();
    },
    _a[Msg.ClientType.WorkMove] = function (session, data) {
        if (!Array.isArray(data))
            return;
        var _a = __read(data, 2), x = _a[0], y = _a[1];
        if (typeof x !== "number" || typeof y !== "number")
            return;
        session.sendOthers({
            type: Msg.HostType.WorkMove,
            data: { uuid: session.clientId, point: [x, y] }
        });
        Redis.client
            .multi()
            .rpush("work:" + session.roomId + ":" + session.clientId + ":x", x.toString())
            .rpush("work:" + session.roomId + ":" + session.clientId + ":y", y.toString())
            .exec();
    },
    _a[Msg.ClientType.Commit] = function (session) {
        session.sendOthers({
            type: Msg.HostType.Commit,
            data: { uuid: session.clientId }
        });
        Redis.client.incr("commit:" + session.roomId + ":stroke:id", function (_, id) {
            Redis.client
                .multi()
                .rpush("commit:" + session.roomId + ":stroke:ids", "" + id)
                .rename("work:" + session.roomId + ":" + session.clientId + ":x", "commit:" + session.roomId + ":strokes:" + id + ":x")
                .rename("work:" + session.roomId + ":" + session.clientId + ":y", "commit:" + session.roomId + ":strokes:" + id + ":y")
                .exec();
        });
    },
    _a);
