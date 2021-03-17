"use strict";
exports.__esModule = true;
exports.Page = void 0;
var Page = /** @class */ (function () {
    function Page() {
        this.work = {};
        this.commits = {};
    }
    Page.prototype.init = function (strokes) {
        var _a;
        var _b;
        // TODO bad
        (_b = this.commits)["init"] || (_b["init"] = []);
        (_a = this.commits["init"]).push.apply(_a, strokes);
    };
    Page.prototype.workStart = function (uuid, point) {
        this.work[uuid] = [point];
    };
    Page.prototype.workMove = function (uuid, point) {
        var _a;
        (_a = this.work[uuid]) === null || _a === void 0 ? void 0 : _a.push(point);
    };
    Page.prototype.commit = function (uuid) {
        var _a;
        (_a = this.commits)[uuid] || (_a[uuid] = []);
        this.commits[uuid].push(this.work[uuid]);
        this.work[uuid] = [];
    };
    return Page;
}());
exports.Page = Page;
