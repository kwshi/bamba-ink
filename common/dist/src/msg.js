"use strict";
exports.__esModule = true;
exports.HostType = exports.ClientType = void 0;
var ClientType;
(function (ClientType) {
    ClientType[ClientType["Join"] = 0] = "Join";
    ClientType[ClientType["WorkStart"] = 1] = "WorkStart";
    ClientType[ClientType["WorkMove"] = 2] = "WorkMove";
    ClientType[ClientType["Commit"] = 3] = "Commit";
})(ClientType = exports.ClientType || (exports.ClientType = {}));
var HostType;
(function (HostType) {
    HostType[HostType["Init"] = 0] = "Init";
    HostType[HostType["WorkStart"] = 1] = "WorkStart";
    HostType[HostType["WorkMove"] = 2] = "WorkMove";
    HostType[HostType["Commit"] = 3] = "Commit";
})(HostType = exports.HostType || (exports.HostType = {}));
