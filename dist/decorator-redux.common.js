/**
 * decorator-redux v1.1.0
 * (c) 2019 luoyefe
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var reactRedux = require('react-redux');
var redux = require('redux');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function objForEach(obj, callback) {
    Object.keys(obj).forEach(function (key) { return callback(obj[key], key); });
}
function chainDefine(map, path, value) {
    if (path.length === 1)
        { return map[path[0]] = value; }
    chainDefine(map[path[0]], path.slice(1), value);
}
function assert(msg) {
    return console.log("%c[decorator-redux]", 'background: #ff5151; color: #fff', "" + msg);
}

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
            { return this.state = nextState; }
        return chainDefine(this.state, path, nextState);
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
            var parent = this.getState(path.slice(0, -1));
            parent[path[path.length - 1]] = rawModule.state;
        }
        if (rawModule.modules) {
            objForEach(rawModule.modules, function (rawChildModule, key) {
                _this.collectionState(path.concat(key), rawChildModule);
            });
        }
    };
    return Module;
}());

function RootStoreDecorator(_a) {
    var store = _a.store;
    return function (OriginComponent) {
        var StoreModules = new Module(store);
        var reactReduxStore = redux.createStore(function () {
            var arguments$1 = arguments;

            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments$1[_i];
            }
            // 处理所有真实 reducer 动作
            var action = args[1];
            var path = StoreModules.getPath(action.type);
            var rawModule = StoreModules.getRawModule(path);
            var rawModuleState = StoreModules.getState(path);
            if (!rawModule || !action.reducerFuncName)
                { return StoreModules.state; }
            if (!rawModule.reducers || !rawModule.reducers[action.reducerFuncName]) {
                assert("reducer: " + action.reducerFuncName + " \u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5");
                return StoreModules.state;
            }
            var nextState = rawModule.reducers[action.reducerFuncName](rawModuleState, action.playload);
            // 以下一个状态更新当前 state 树
            StoreModules.updateState(path, nextState);
            return __assign({}, StoreModules.state);
        }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
        var RootStoreComponent = /** @class */ (function (_super) {
            __extends(RootStoreComponent, _super);
            function RootStoreComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RootStoreComponent.prototype.getChildContext = function () {
                return {
                    dispatch: this.dispatch.bind(this),
                    originStore: reactReduxStore,
                };
            };
            RootStoreComponent.prototype.dispatch = function (action, playload) {
                // 等待 action 执行完成再 向 redux dispatch 真实 action，实现异步 action
                var _this = this;
                var splitArray = action.split('/');
                var actionFuncName = splitArray[splitArray.length - 1];
                var rawModule = StoreModules.getRawModule(StoreModules.getPath(action));
                function dispatchHelper(reducerFuncName, playload) {
                    _this.props.dispatch({ type: action, playload: playload, reducerFuncName: reducerFuncName });
                }
                if (!rawModule.actions || !rawModule.actions[actionFuncName])
                    { return assert("action: " + action + " \u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5"); }
                rawModule.actions[actionFuncName]({ dispatch: dispatchHelper }, playload);
            };
            RootStoreComponent.prototype.render = function () {
                return (React__default.createElement(OriginComponent, { store: {
                        state: this.props.state,
                        dispatch: this.dispatch.bind(this),
                        originStore: reactReduxStore,
                    } }));
            };
            RootStoreComponent.childContextTypes = {
                dispatch: PropTypes.func,
                originStore: PropTypes.object,
            };
            return RootStoreComponent;
        }(React.PureComponent));
        var ConnectComponent = reactRedux.connect(function (state) {
            return { state: state };
        })(RootStoreComponent);
        var ProviderComponent = /** @class */ (function (_super) {
            __extends(ProviderComponent, _super);
            function ProviderComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ProviderComponent.prototype.render = function () {
                return (React__default.createElement(reactRedux.Provider, { store: reactReduxStore },
                    React__default.createElement(ConnectComponent, null)));
            };
            return ProviderComponent;
        }(React.PureComponent));
        return ProviderComponent;
    };
}

function ChildStoreDecorator() {
    return function (OriginComponent) {
        var ChildStoreComponent = /** @class */ (function (_super) {
            __extends(ChildStoreComponent, _super);
            function ChildStoreComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ChildStoreComponent.prototype.render = function () {
                return (React__default.createElement(OriginComponent, __assign({ store: {
                        state: this.props.state,
                        dispatch: this.context.dispatch.bind(this),
                        originStore: this.context.originStore,
                    } }, this.props)));
            };
            ChildStoreComponent.contextTypes = {
                dispatch: PropTypes.func,
                originStore: PropTypes.object,
            };
            return ChildStoreComponent;
        }(React.PureComponent));
        return reactRedux.connect(function (state) {
            return { state: state };
        })(ChildStoreComponent);
    };
}

exports.RootStoreDecorator = RootStoreDecorator;
exports.ChildStoreDecorator = ChildStoreDecorator;
