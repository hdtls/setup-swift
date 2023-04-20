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
      '-y',
      'install',
      'binutils',
      'gcc',
      'git',
      'glibc-static',
      'gzip',
      'libbsd',
      'libcurl',
      'libcurl-devel',
      'libedit',
      'libicu',
      'libsqlite',
      'libstdc++-static',
      'libuuid',
      'libxml2',
      'tar',
      'tzdata'
    ];
    await exec.exec('yum', args);
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
