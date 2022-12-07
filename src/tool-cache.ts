import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import assert from 'assert';
import * as fs from 'fs';
import path from 'path';
import { getCacheVersion } from './utils';

export {
  downloadTool,
  extractTar,
  extractXar,
  IToolRelease
} from '@actions/tool-cache';

export function find(toolName: string, versionSpec: string, arch?: string) {
  const version = getCacheVersion(versionSpec);

  if (/^\d+.\d+(.\d+)?$/.test(version)) {
    return tc.find(toolName, version, arch);
  }

  //
  // Find cache for nightly versions
  //
  arch = arch || process.arch;

  let toolPath = '';
  const cachePath = path.join(_getCacheDirectory(), toolName, version, arch);

  core.debug(`checking cache: ${cachePath}`);
  // If exists version is newer than required version return cached tool path otherwise return ''
  if (
    !fs.existsSync(path.join(cachePath, 'latest-build.yml')) ||
    !fs.existsSync(`${cachePath}.complete`)
  ) {
    core.debug('not found');
    return toolPath;
  }

  const latest = fs
    .readFileSync(path.join(cachePath, 'latest-build.yml'))
    .toString()
    .replace(/^dir: (.*)/, '$1');

  if (latest >= versionSpec) {
    core.debug(`Found tool in cache ${toolName} ${latest} ${arch}`);
    toolPath = cachePath;
  } else {
    core.debug('not found');
  }

  return toolPath;
}

export async function cacheDir(
  sourceDir: string,
  tool: string,
  versionSpec: string,
  arch?: string
) {
  let version = getCacheVersion(versionSpec);

  if (/^\d+.\d+(.\d+)?$/.test(version)) {
    if (/^\d+.\d+$/.test(version)) {
      version = version + '.0';
    }
    return await tc.cacheDir(sourceDir, tool, version, arch);
  }

  //
  // Cache nightly versions
  //
  const toolPath = await tc.cacheDir(sourceDir, tool, version, arch);
  fs.writeFileSync(
    path.join(toolPath, 'latest-build.yml'),
    `dir: ${versionSpec}`
  );
  return toolPath;
}

/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
  const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
  assert.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
  return cacheDirectory;
}
