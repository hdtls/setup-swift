import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as ioUtil from '@actions/io/lib/io-util';
import * as os from 'os';
import * as tc from './tool-cache';
import * as utils from './utils';
import * as re from './re';
import * as toolchains from './toolchains';
import path from 'path';

export async function find(
  manifest: tc.IToolRelease,
  arch: string = os.arch()
) {
  // Do NOT evaluate unstable version swift tool finding.
  if (
    re.SWIFT_NIGHTLY.test(manifest.version) ||
    re.SWIFT_MAINLINE_NIGHTLY.test(manifest.version)
  ) {
    core.info(`Version ${manifest.version} was not found in the local cache`);
    return '';
  }

  let toolPaths: string[] = [];
  let toolPath = '';

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
          toolPaths = (await ioUtil.readdir('/Library/Developer/Toolchains'))
            .filter(toolPath => toolPath.endsWith('.xctoolchain'))
            .concat(toolPaths);
        } catch (error) {}

        try {
          toolPaths = (
            await ioUtil.readdir(toolchains.getToolchainsDirectory())
          )
            .filter(toolPath => toolPath.endsWith('.xctoolchain'))
            .concat(toolPaths);
        } catch (error) {}

        toolPaths.push(toolchains.getXcodeDefaultToolchain());

        toolPaths = toolPaths
          .filter(async toolPath => {
            try {
              const stats = await ioUtil.lstat(toolPath);
              const commandLine = path.join(toolPath, '/usr/bin/swift');
              const exsits = await ioUtil.exists(commandLine);
              return !stats.isSymbolicLink() && exsits;
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

  // Check default installed...
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
      utils.getVersion(stdout) ==
      manifest.version.replace(re.SWIFT_RELEASE, '$1')
    ) {
      core.debug(`Found tool in ${toolPath} ${manifest.version} ${arch}`);
      return toolPath;
    }
    core.debug('Not found');
  }

  // Check setup-swift action installed...
  toolPath = tc.find('swift', manifest.version, arch);
  if (!toolPath) {
    core.info(`Version ${manifest.version} was not found in the local cache`);
    return '';
  }
  return path.join(toolPath, '/usr/bin');
}
