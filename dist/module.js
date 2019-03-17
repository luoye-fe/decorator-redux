"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Module = /** @class */ (function () {
    function Module(rawModule) {
        this.state = Object.create(null);
        this._rawModule = rawModule;
        this.collectionState([], rawModule);
    }
    // 根据路径获取具体 state
    Module.prototype.getState = function (path) {
        return path.reduce(function (state, key) {
            return state[key];
        }, this.state);
    };
    // 根据路径获取具体 rawModule
    Module.prototype.getRawModule = function (path) {
        return path.reduce(function (module, key) {
            return module.modules[key];
        }, this._rawModule);
    };
    // 更新整棵树
    Module.prototype.updateState = function (path, nextState) {
        if (path.length === 0)
            return this.state = nextState;
        return utils_1.chainDefine(this.state, path, nextState);
    };
    Module.prototype.getPath = function (pathString) {
        return pathString.split('/').slice(0, -1);
    };
    // 递归整颗树，获取 state 集合
    Module.prototype.collectionState = function (path, rawModule) {
        var _this = this;
        if (path.length === 0) {
            this.state = rawModule.state;
        }
        else {
            var parent_1 = this.getState(path.slice(0, -1));
            parent_1[path[path.length - 1]] = rawModule.state;
        }
        if (rawModule.modules) {
            utils_1.objForEach(rawModule.modules, function (rawChildModule, key) {
                _this.collectionState(path.concat(key), rawChildModule);
            });
        }
    };
    return Module;
}());
exports.default = Module;
