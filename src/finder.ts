import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as fs from 'fs';
import * as utils from './utils';
import * as toolchains from './toolchains';
import * as path from 'path';
import * as formatter from './formatter';
import { re, t } from './re';

/**
 * Finds the path for tool in the system-wide
 *
 * @param manifest  info of the tool
 * @param arch      optional arch. defaults to arch of computer
 * @returns         path where executable file located. return empty if not found
 */
export async function find(
  manifest: tc.IToolRelease,
  arch: string = os.arch()
): Promise<string> {
  // Check setup-swift action installed...
  let version = formatter.parse(manifest.version);
  let toolPath = tc.find('swift', version, arch);
  if (toolPath.length) {
    return path.join(toolPath, '/usr/bin');
  }

  // System-wide lookups for nightly versions will be ignored.
  if (!re[t.SWIFTRELEASE].test(manifest.version)) {
    core.info(`Version ${manifest.version} was not found in the local cache`);
    return '';
  }

  let toolPaths: string[] = [];

  // Platform specified system-wide finding.
  switch (manifest.files[0].platform) {
    case 'darwin':
      toolPaths = _getAllToolchains();
      // Filter toolchains who's name contains version
      const matched = toolPaths.filter(e => e.indexOf(manifest.version) > -1);
      if (matched.length) {
        return matched[0];
      }
      break;
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
      toolPaths = (await io.findInPath('swift')).map(commandLine => {
        return commandLine.split('/').slice(0, -1).join('/');
      });
      break;
    default:
      break;
  }

  // Check user installed...
  for (const toolPath of toolPaths) {
    core.debug(`Checking installed tool in ${toolPath}`);
    const commandLine = path.join(toolPath, 'swift');
    const options: exec.ExecOptions = { silent: true };
    const { stdout } = await exec.getExecOutput(
      commandLine,
      ['--version'],
      options
    );

    if (
      utils.extractVerFromLogMessage(stdout) ==
      manifest.version.replace(re[t.SWIFTRELEASE], '$1')
    ) {
      core.debug(`Found tool in ${toolPath} ${manifest.version} ${arch}`);
      return toolPath;
    }
  }

  core.info(`Version ${manifest.version} was not found in the local cache`);
  return '';
}

/**
 * Find toolchains located in:
 *   /Library/Developer/Toolchains
 *   /Users/runner/Library/Developer/Toolchains
 *   /Applications/Xcode.app/Contents/Developer/Toolchains
 */
export function _getAllToolchains(): string[] {
  const systemLibrary = toolchains.getSystemToolchainsDirectory();
  const userLibrary = toolchains.getToolchainsDirectory();
  const xcodeLibrary = toolchains.getXcodeDefaultToolchainsDirectory();

  return fs
    .readdirSync(systemLibrary, { withFileTypes: true })
    .concat(fs.readdirSync(userLibrary, { withFileTypes: true }))
    .concat(fs.readdirSync(xcodeLibrary, { withFileTypes: true }))
    .filter(dirent => {
      if (dirent.isDirectory() && dirent.name.endsWith('.xctoolchain')) {
        try {
          const commandLine = path.join(
            dirent.path,
            dirent.name,
            '/usr/bin/swift'
          );
          return fs.existsSync(commandLine);
        } catch {
          return false;
        }
      }
      return false;
    })
    .map(dirent => path.join(dirent.path, dirent.name, 'usr/bin'));
}
