import util from 'util';
import { exec as originalExec } from 'child_process';

export const exec = util.promisify(originalExec);
export const execComandStdout = command =>
  exec(command).then(({ stdout }) => stdout);
export const cleanUpFromStdout = response => response.split('\n')[0];
