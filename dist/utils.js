"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objForEach(obj, callback) {
    Object.keys(obj).forEach(function (key) { return callback(obj[key], key); });
}
exports.objForEach = objForEach;
function chainDefine(map, path, value) {
    if (path.length === 1)
        return map[path[0]] = value;
    chainDefine(map[path[0]], path.slice(1), value);
}
exports.chainDefine = chainDefine;
function assert(msg) {
    return console.log("%c[decorator-redux]", 'background: #ff5151; color: #fff', "" + msg);
}
exports.assert = assert;
