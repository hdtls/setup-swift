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
    core.info((error as Error).message);
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
