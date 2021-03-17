"use strict";
exports.__esModule = true;
exports.isOwnPropertyOf = exports.hasOwnProperty = void 0;
var hasOwnProperty = function (obj, prop) { return obj.hasOwnProperty(prop); };
exports.hasOwnProperty = hasOwnProperty;
var isOwnPropertyOf = function (prop, obj) { return obj.hasOwnProperty(prop); };
exports.isOwnPropertyOf = isOwnPropertyOf;
