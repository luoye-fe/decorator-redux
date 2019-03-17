"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __importDefault(require("./decorator/root"));
exports.RootStoreDecorator = root_1.default;
var child_1 = __importDefault(require("./decorator/child"));
exports.ChildStoreDecorator = child_1.default;
