import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';

/**
 * Import Swift gpg keys
 */
export async function importKeys() {
  let keys = await tc.downloadTool('https://swift.org/keys/all-keys.asc');

  await exec.exec('gpg', ['--import', keys]);
}

/**
 * Verify archive with given signature
 *
 * @param signature tool signature
 * @param archive   tool path
 */
export async function verify(signature: string, archive: string) {
  await exec.exec('gpg', [
    '--keyserver',
    'hkp://keyserver.ubuntu.com',
    '--refresh-keys',
    'Swift'
  ]);

  await exec.exec('gpg', ['--verify', signature, archive]);
}
