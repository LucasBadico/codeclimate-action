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
const os_1 = require("os");
const fs_1 = require("fs");
const helpers_1 = require("./helpers");
const env_helpers_1 = require("./env-helpers");
const exec_helpers_1 = require("./exec-helpers");
const DEFAULT_CODECLIMATE_DEBUG = 'false';
const DOWNLOAD_URL = `https://codeclimate.com/downloads/test-reporter/test-reporter-latest-${os_1.platform()}-amd64`;
const EXECUTABLE = './cc-reporter';
const DEFAULT_COVERAGE_COMMAND = 'yarn test';
const DEFAULT_SILENT_FLAG = 'true';
function run(downloadUrl = DOWNLOAD_URL, executable = EXECUTABLE, coverageCommand = DEFAULT_COVERAGE_COMMAND, debugFlag = DEFAULT_CODECLIMATE_DEBUG, silentFlag = DEFAULT_SILENT_FLAG) {
    const silentMode = helpers_1.parseBoolean(silentFlag);
    const debugMode = helpers_1.parseBoolean(debugFlag);
    const handleDebug = (...args) => {
        if (!debugMode)
            return true;
        if (silentMode)
            return console.log(args[0]);
        return console.log(...args);
    };
    const handleError = (message, err, error, success) => {
        if (debugMode)
            console.error(message);
        if (silentMode)
            return success(`${message}, report not sent to codeclimate.`, err);
        return error(message, err);
    };
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            handleDebug(`ℹ️ Downloading CC Reporter from ${downloadUrl} ...`);
            if (!fs_1.existsSync(EXECUTABLE)) {
                const data = yield helpers_1.downloadToFile(downloadUrl, executable);
                handleDebug('✅ CC Reporter downloaded...', data);
            }
        }
        catch (err) {
            return handleError('🚨 CC Reporter download failed!', err, reject, resolve);
        }
        const execOpts = {
            env: yield env_helpers_1.prepareEnv()
        };
        handleDebug('ℹ️ Env', execOpts.env);
        try {
            const data = yield exec_helpers_1.exec(`${executable} before-build`, execOpts);
            handleDebug('✅ CC Reporter before-build checkin completed...', data);
        }
        catch (err) {
            return handleError('🚨 CC Reporter before-build checkin failed!', err, reject, resolve);
        }
        try {
            const data = yield exec_helpers_1.exec(coverageCommand, execOpts).catch(err => {
                if (silentMode)
                    return '🚨 Failed tests, but keeping the reporter ...';
                throw err;
            });
            handleDebug('✅ Coverage run completed...', data);
        }
        catch (err) {
            return handleError('🚨 Coverage run failed!', err, reject, resolve);
        }
        try {
            const commands = ['after-build'];
            if (debugFlag === 'true')
                commands.push('--debug');
            const data = yield exec_helpers_1.exec(`${executable} after-build`, execOpts);
            handleDebug('✅ CC Reporter after-build checkin completed!', data);
        }
        catch (err) {
            return handleError('🚨 CC Reporter after-build checkin failed!', err, reject, resolve);
        }
        return resolve('✅ Coverage report sended to codeclimate');
    }));
}
exports.run = run;
