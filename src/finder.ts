import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as os from 'os';
import * as fs from 'fs';
import * as tc from './tool-cache';
import * as utils from './utils';
import * as toolchains from './toolchains';
import * as path from 'path';
import { re, t } from './re';

/**
 * Finds the path for tool in the system-wide
 *
 * @param manifest  info of the tool
 * @param arch      optional arch. defaults to arch of computer
 * @returns         path for the founded tool. return empty if not found
 */
export async function find(
  manifest: tc.IToolRelease,
  arch: string = os.arch()
) {
  let toolPath = '';

  // System-wide lookups for nightly versions will be ignored.
  if (re[t.SWIFTRELEASE].test(manifest.version)) {
    let toolPaths: string[] = [];

    // Platform specified system-wide finding.
    switch (manifest.files[0].platform) {
      case 'darwin':
        /**
         * Find toolchains located in:
         *   /Library/Developer/Toolchains
         *   /Users/runner/Library/Developer/Toolchains
         *   /Applications/Xcode.app/Contents/Developer/Toolchains
         */
        try {
          try {
            toolPaths = fs
              .readdirSync(toolchains.getSystemToolchainsDirectory())
              .filter(toolchain => toolchain.endsWith('.xctoolchain'))
              .map(toolchain =>
                path.join(toolchains.getSystemToolchainsDirectory(), toolchain)
              )
              .concat(toolPaths);
          } catch (error) {}

          try {
            toolPaths = fs
              .readdirSync(toolchains.getToolchainsDirectory())
              .filter(toolchain => toolchain.endsWith('.xctoolchain'))
              .map(toolchain =>
                path.join(toolchains.getToolchainsDirectory(), toolchain)
              )
              .concat(toolPaths);
          } catch (error) {}

          try {
            toolPaths = fs
              .readdirSync(toolchains.getXcodeDefaultToolchainsDirectory())
              .filter(toolchain => toolchain.endsWith('.xctoolchain'))
              .map(toolchain =>
                path.join(
                  toolchains.getXcodeDefaultToolchainsDirectory(),
                  toolchain
                )
              )
              .concat(toolPaths);
          } catch (error) {}

          toolPaths = toolPaths
            .filter(toolPath => {
              try {
                const commandLine = path.join(toolPath, '/usr/bin/swift');
                return fs.existsSync(commandLine);
              } catch (error) {
                return false;
              }
            })
            .map(toolPath => path.join(toolPath, '/usr/bin'));
        } catch (error) {}
        break;
      case 'ubuntu':
      case 'centos':
      case 'amazonlinux':
        try {
          toolPaths = (await io.findInPath('swift')).map(commandLine => {
            return commandLine.split('/').slice(0, -1).join('/');
          });
        } catch (error) {}
        break;
      default:
        break;
    }

    // Check user installed...
    for (const toolPath of toolPaths) {
      core.debug(`Checking installed tool in ${toolPath}`);
      const commandLine = path.join(toolPath, 'swift');
      const options: exec.ExecOptions = { silent: true };
      try {
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
      } catch (error) {}
      core.debug('Not found');
    }
  }

  // Check setup-swift action installed...
  toolPath = tc.find('swift', manifest.version, arch);
  if (!toolPath) {
    core.info(`Version ${manifest.version} was not found in the local cache`);
    return '';
  }
  return path.join(toolPath, '/usr/bin');
}
