"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const child_process_1 = require("child_process");
exports.exec = util_1.default.promisify(child_process_1.exec);
exports.execComandStdout = command => exports.exec(command).then(({ stdout }) => stdout);
exports.cleanUpFromStdout = response => response.split('\n')[0];
