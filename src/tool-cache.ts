import * as core from '@actions/core';
import * as fs from 'fs';
import assert from 'assert';
import path from 'path';

export {
  cacheDir,
  downloadTool,
  extractTar,
  extractXar,
  IToolRelease
} from '@actions/tool-cache';

export function find(toolName: string, versionSpec: string, arch?: string) {
  if (!toolName) {
    throw new Error('toolName parameter is required');
  }
  if (!versionSpec) {
    throw new Error('versionSpec parameter is required');
  }

  arch = arch || process.arch;

  let toolPath = '';

  const cachePath = path.join(
    _getCacheDirectory(),
    toolName,
    versionSpec,
    arch
  );

  core.debug(`checking cache: ${cachePath}`);
  if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
    core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
    toolPath = cachePath;
  } else {
    core.debug('not found');
  }

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
