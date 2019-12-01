"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_helpers_1 = require("./exec-helpers");
function prepareEnv() {
    return __awaiter(this, void 0, void 0, function* () {
        function getCommitSHA() {
            return __awaiter(this, void 0, void 0, function* () {
                return exec_helpers_1.cleanUpFromStdout(yield exec_helpers_1.execComandStdout('git rev-parse HEAD'));
            });
        }
        function getBranch() {
            return __awaiter(this, void 0, void 0, function* () {
                return exec_helpers_1.cleanUpFromStdout(yield exec_helpers_1.execComandStdout('git rev-parse --abbrev-ref HEAD'));
            });
        }
        const env = process.env;
        const GIT_BRANCH = yield getBranch();
        const GIT_COMMIT_SHA = yield getCommitSHA();
        return Object.assign(Object.assign({}, env), { GIT_BRANCH,
            GIT_COMMIT_SHA });
    });
}
exports.prepareEnv = prepareEnv;
