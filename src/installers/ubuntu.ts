import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '../tool-cache';
import * as defaults from './defaults';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
export async function install(manifest: tc.IToolRelease) {
  try {
    let args: string[] = [];
    switch (manifest.files[0].platform_version) {
      case '18.04':
        args = [
          '-y',
          'install',
          'binutils',
          'git',
          'libc6-dev',
          'libcurl4',
          'libedit2',
          'libgcc-5-dev',
          'libpython2.7',
          'libsqlite3-0',
          'libstdc++-5-dev',
          'libxml2',
          'pkg-config',
          'tzdata',
          'zlib1g-dev'
        ];
        break;
      case '20.04':
        args = [
          '-y',
          'install',
          'binutils',
          'git',
          'gnupg2',
          'libc6-dev',
          'libcurl4',
          'libedit2',
          'libgcc-9-dev',
          'libpython2.7',
          'libsqlite3-0',
          'libstdc++-9-dev',
          'libxml2',
          'libz3-dev',
          'pkg-config',
          'tzdata',
          'uuid-dev',
          'zlib1g-dev'
        ];
        break;
      default:
        // 22.04
        args = [
          '-y',
          'install',
          'binutils',
          'git',
          'gnupg2',
          'libc6-dev',
          'libcurl4-openssl-dev',
          'libedit2',
          'libgcc-9-dev',
          'libpython3.8',
          'libsqlite3-0',
          'libstdc++-9-dev',
          'libxml2-dev',
          'libz3-dev',
          'pkg-config',
          'tzdata',
          'unzip',
          'zlib1g-dev'
        ];
        break;
    }
    await exec.exec('apt-get', args);
  } catch (error) {
    core.warning((error as Error).message);
  }
  await defaults.install(manifest);
}

/**
 * Export path or any other relative variables
 *
 * @param manifest manifest for installed tool
 * @param toolPath installed tool path
 */
export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  await defaults.exportVariables(manifest, toolPath);
}
