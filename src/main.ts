import { platform } from 'os';
import { existsSync } from 'fs';
import { parseBoolean, downloadToFile } from './helpers';
import { prepareEnv } from './env-helpers';
import { exec } from './exec-helpers';

const DEFAULT_CODECLIMATE_DEBUG = 'false';
const DOWNLOAD_URL = `https://codeclimate.com/downloads/test-reporter/test-reporter-latest-${platform()}-amd64`;
const EXECUTABLE = './cc-reporter';
const DEFAULT_COVERAGE_COMMAND = 'yarn test';
const DEFAULT_SILENT_FLAG = 'true';

export function run(
  downloadUrl: string = DOWNLOAD_URL,
  executable: string = EXECUTABLE,
  coverageCommand: string = DEFAULT_COVERAGE_COMMAND,
  debugFlag: string = DEFAULT_CODECLIMATE_DEBUG,
  silentFlag: string = DEFAULT_SILENT_FLAG
): Promise<string> {
  const silentMode = parseBoolean(silentFlag);
  const debugMode = parseBoolean(debugFlag);
  let testsFailing = true;
  const handleDebug = (...args) => {
    if (!debugMode) return true;
    if (silentMode) return console.log(args[0]);
    return console.log(...args);
  };

  const handleError = (message, err, error, success) => {
    if (debugMode) console.error(message);
    if (silentMode)
      return success(`${message}, report not sent to codeclimate.`, err);
    return error(message, err);
  };

  return new Promise(async (resolve, reject) => {
    try {
      handleDebug(`ℹ️ Downloading CC Reporter from ${downloadUrl} ...`);
      if (!existsSync(EXECUTABLE)) {
        const data = await downloadToFile(downloadUrl, executable);
        handleDebug('✅ CC Reporter downloaded...', data);
      }
    } catch (err) {
      return handleError(
        '🚨 CC Reporter download failed!',
        err,
        reject,
        resolve
      );
    }

    const execOpts = {
      env: await prepareEnv()
    };
    handleDebug('ℹ️ Env', execOpts.env);
    try {
      const data = await exec(`${executable} before-build`, execOpts);
      handleDebug('✅ CC Reporter before-build checkin completed...', data);
    } catch (err) {
      return handleError(
        '🚨 CC Reporter before-build checkin failed!',
        err,
        reject,
        resolve
      );
    }
    try {
      const data = await exec(coverageCommand, execOpts)
        .then(data => {
          testsFailing = false;
          return data;
        })
        .catch(err => {
          if (silentMode)
            return '🚨 Failed tests, but keeping the reporter ...';
          throw err;
        });
      handleDebug('✅ Coverage run completed...', data);
    } catch (err) {
      return handleError('🚨 Coverage run failed!', err, reject, resolve);
    }
    try {
      const commands = ['after-build'];
      if (debugFlag === 'true') commands.push('--debug');
      const data = await exec(`${executable} after-build`, execOpts);
      handleDebug('✅ CC Reporter after-build checkin completed!', data);
    } catch (err) {
      return handleError(
        '🚨 CC Reporter after-build checkin failed!',
        err,
        reject,
        resolve
      );
    }
    if (testsFailing)
      return resolve(
        '🚨 Tests failing, but coverage report sent to codeclimate'
      );
    return resolve('✅ Tests passing and coverage report sent to codeclimate');
  });
}
