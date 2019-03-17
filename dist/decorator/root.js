"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var module_1 = __importDefault(require("../module"));
var utils_1 = require("../utils");
function RootStoreDecorator(_a) {
    var store = _a.store;
    return function (OriginComponent) {
        var StoreModules = new module_1.default(store);
        var reactReduxStore = redux_1.createStore(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // 处理所有真实 reducer 动作
            var action = args[1];
            var path = StoreModules.getPath(action.type);
            var rawModule = StoreModules.getRawModule(path);
            var rawModuleState = StoreModules.getState(path);
            if (!rawModule || !action.reducerFuncName)
                return StoreModules.state;
            if (!rawModule.reducers || !rawModule.reducers[action.reducerFuncName]) {
                utils_1.assert("reducer: " + action.reducerFuncName + " \u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5");
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
                    return utils_1.assert("action: " + action + " \u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5");
                rawModule.actions[actionFuncName]({ dispatch: dispatchHelper }, playload);
            };
            RootStoreComponent.prototype.render = function () {
                return (react_1.default.createElement(OriginComponent, { store: {
                        state: this.props.state,
                        dispatch: this.dispatch.bind(this),
                        originStore: reactReduxStore,
                    } }));
            };
            RootStoreComponent.childContextTypes = {
                dispatch: prop_types_1.default.func,
                originStore: prop_types_1.default.object,
            };
            return RootStoreComponent;
        }(react_1.PureComponent));
        var ConnectComponent = react_redux_1.connect(function (state) {
            return { state: state };
        })(RootStoreComponent);
        var ProviderComponent = /** @class */ (function (_super) {
            __extends(ProviderComponent, _super);
            function ProviderComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ProviderComponent.prototype.render = function () {
                return (react_1.default.createElement(react_redux_1.Provider, { store: reactReduxStore },
                    react_1.default.createElement(ConnectComponent, null)));
            };
            return ProviderComponent;
        }(react_1.PureComponent));
        return ProviderComponent;
    };
}
exports.default = RootStoreDecorator;
