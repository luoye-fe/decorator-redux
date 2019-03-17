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
function ChildStoreDecorator() {
    return function (OriginComponent) {
        var ChildStoreComponent = /** @class */ (function (_super) {
            __extends(ChildStoreComponent, _super);
            function ChildStoreComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ChildStoreComponent.prototype.render = function () {
                return (react_1.default.createElement(OriginComponent, { store: {
                        state: this.props.state,
                        dispatch: this.context.dispatch.bind(this),
                        originStore: this.context.originStore,
                    } }));
            };
            ChildStoreComponent.contextTypes = {
                dispatch: prop_types_1.default.func,
                originStore: prop_types_1.default.object,
            };
            return ChildStoreComponent;
        }(react_1.PureComponent));
        return react_redux_1.connect(function (state) {
            return { state: state };
        })(ChildStoreComponent);
    };
}
exports.default = ChildStoreDecorator;
