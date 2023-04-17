import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as fs from 'fs';
import path from 'path';
import assert from 'assert';
import { re, src, t, coerce } from './re';

export {
  downloadTool,
  evaluateVersions,
  extractTar,
  extractXar,
  isExplicitVersion,
  IToolRelease
} from '@actions/tool-cache';

/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   tag of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */
export function find(toolName: string, versionSpec: string, arch?: string) {
  const version = _getCacheVersion(versionSpec);

  const pattern = `^(?:main|${src[t.NUMERICIDENTIFIER]}\\.${
    src[t.NUMERICIDENTIFIER]
  })\\+${src[t.NUMERICIDENTIFIER]}$`;

  if (!new RegExp(pattern).test(version)) {
    return tc.find(toolName, version, arch);
  }

  if (!toolName) {
    throw new Error('toolName parameter is required');
  }
  if (!versionSpec) {
    throw new Error('versionSpec parameter is required');
  }

  arch = arch || os.arch();
  let toolPath = '';
  const cachePath = path.join(_getCacheDirectory(), toolName, version, arch);
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
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir     the directory to cache into tools
 * @param tool          tool name
 * @param versionSpec   tag of the tool
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
export async function cacheDir(
  sourceDir: string,
  tool: string,
  versionSpec: string,
  arch?: string
) {
  let version = _getCacheVersion(versionSpec);
  return await tc.cacheDir(sourceDir, tool, version, arch);
}

/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
  const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
  assert.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
  return cacheDirectory;
}

/**
 * Gets tool cache version from specified swift tag.
 *
 * @param versionSpec   the tag of tool
 * @returns             resolved tool cache version
 */
export function _getCacheVersion(versionSpec: string) {
  switch (true) {
    case re[t.SWIFTRELEASE].test(versionSpec):
      versionSpec = versionSpec.replace(re[t.SWIFTRELEASE], '$1');
      return coerce(versionSpec);
    case re[t.SWIFTNIGHTLY].test(versionSpec):
      return versionSpec.replace(re[t.SWIFTNIGHTLY], '$1+$5$6$7');
    case re[t.SWIFTMAINLINENIGHTLY].test(versionSpec):
      return versionSpec.replace(re[t.SWIFTMAINLINENIGHTLY], 'main+$1$2$3');
    default:
      throw new Error(
        `Cannot resolve cache tool version for an unsupported version: ${versionSpec}`
      );
  }
}
