import { platform } from 'os';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import util from 'util';
import fs from 'fs';
import { exec as originalExec } from 'child_process';

const exec = util.promisify(originalExec);

// import { debug, error, setFailed, getInput } from '@actions/core';
// import { exec } from '@actions/exec';
// import { ExecOptions } from '@actions/exec/lib/interfaces';

const debug = console.log;
const error = console.error;

const DOWNLOAD_URL = `https://codeclimate.com/downloads/test-reporter/test-reporter-latest-${platform()}-amd64`;
const EXECUTABLE = './cc-reporter';
const DEFAULT_COVERAGE_COMMAND = 'yarn coverage';
const DEFAULT_CODECLIMATE_DEBUG = 'true';

const execComandStdout = (command) => exec(command).then(({ stdout }) => stdout);

function getCommitSHA() {
  return execComandStdout('git rev-parse HEAD');
}

async function getBranch() {
  const lines = await execComandStdout('git rev-parse --abbrev-ref HEAD');
  return lines.split('\n')[0];
}

export function downloadToFile(
  url: string,
  file: string,
  mode: number = 0o755
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, { timeout: 2 * 60 * 1000 }); // Timeout in 2 minutes.
      const writer = createWriteStream(file, { mode });
      response.body.pipe(writer);
      writer.on('close', () => {
        return resolve();
      });
    } catch (err) {
      return reject(err);
    }
  });
}

async function prepareEnv() {
  const env = process.env as { [key: string]: string };
  const GIT_BRANCH = await getBranch();
  const GIT_COMMIT_SHA = await getCommitSHA();
  return {
    ...env,
    GIT_BRANCH,
    GIT_COMMIT_SHA,
  };
}

export function run(
  downloadUrl: string = DOWNLOAD_URL,
  executable: string = EXECUTABLE,
  coverageCommand: string = DEFAULT_COVERAGE_COMMAND,
  codeClimateDebug: string = DEFAULT_CODECLIMATE_DEBUG
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let lastExitCode = 1;
    try {
      debug(`ℹ️ Downloading CC Reporter from ${downloadUrl} ...`);
      if (!fs.existsSync(EXECUTABLE)) {
        await downloadToFile(downloadUrl, executable);
        debug('✅ CC Reporter downloaded...');
      }
    } catch (err) {
      error(err.message);
      error('🚨 CC Reporter download failed!');
      return reject(err);
    }

    const execOpts = {
      env: await prepareEnv(),
    };
    
    try {
      lastExitCode = await exec(`${executable} before-build`, execOpts).then(() => 0);
      debug('✅ CC Reporter before-build checkin completed...');
    } catch (err) {
      error(err);
      error('🚨 CC Reporter before-build checkin failed!');
      return reject(err);
    }
    try {
      lastExitCode = await exec(coverageCommand, execOpts).then(() => 0);
      if (lastExitCode !== 0) {
        throw new Error(`Coverage run exited with code ${lastExitCode}`);
      }
      debug('✅ Coverage run completed...');
    } catch (err) {
      error(err);
      error('🚨 Coverage run failed!');
      return reject(err);
    }
    try {
      const commands = ['after-build', '--exit-code', lastExitCode.toString()];
      if (codeClimateDebug === 'true') commands.push('--debug');
      await exec(`${executable} ${commands.join(' ')}`, execOpts);
      debug('✅ CC Reporter after-build checkin completed!');
      return resolve();
    } catch (err) {
      error(err);
      error('🚨 CC Reporter after-build checkin failed!');
      return reject(err);
    }
  });
}
