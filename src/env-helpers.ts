import { execComandStdout, cleanUpFromStdout } from './exec-helpers';

export async function prepareEnv() {
  async function getCommitSHA() {
    return cleanUpFromStdout(await execComandStdout('git rev-parse HEAD'));
  }

  async function getBranch() {
    return cleanUpFromStdout(
      await execComandStdout('git rev-parse --abbrev-ref HEAD')
    );
  }
  const env = process.env as { [key: string]: string };
  const GIT_BRANCH = await getBranch();
  const GIT_COMMIT_SHA = await getCommitSHA();
  return {
    ...env,
    GIT_BRANCH,
    GIT_COMMIT_SHA
  };
}
