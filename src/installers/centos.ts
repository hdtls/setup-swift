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
    const args = [
      '-q',
      'install',
      '-y',
      'binutils',
      'gcc',
      'git',
      'glibc-static',
      'libbsd-devel',
      'libedit',
      'libedit-devel',
      'libicu-devel',
      'libstdc++-static',
      'pkg-config',
      'python2',
      'sqlite'
    ];
    await exec.exec('yum', args);
    await exec.exec('sed', [
      '-i',
      '-e',
      "'s/*__block/*__libc_block/g'",
      '/usr/include/unistd.h'
    ]);
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
