import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '../tool-cache';
import * as defaults from './defaults';

/**
 * Download and install tools define in release file
 *
 * @param tag the swift vertion tag
 * @param release release file, contains filename platform platform_version arch and download_url
 */
export async function install(tag: string, release: tc.IToolReleaseFile) {
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
  await defaults.install(tag, release);
}

/**
 * Export path or any other relative variables
 *
 * @param tag the swift version tag
 * @param toolPath installed tool path
 */
export async function exportVariables(tag: string, toolPath: string) {
  await defaults.exportVariables(tag, toolPath);
}
