import * as core from '@actions/core';
import * as exec from '@actions/exec';
import path from 'path';
import * as fs from 'fs';
import * as tc from './tool-cache';
import * as toolchains from './toolchains';
import * as utils from './utils';
import * as re from './re';

export async function find(manifest: tc.IToolRelease) {
  let toolPath = tc.find('swift', manifest.version);

  if (toolPath) {
    return toolPath;
  }

  // If required version is nightly version just return not found.
  if (
    re.SWIFT_NIGHTLY.test(manifest.version) ||
    re.SWIFT_MAINLINE_NIGHTLY.test(manifest.version)
  ) {
    core.info(`Version ${manifest.version} was not found in the local cache`);
    return '';
  }

  let commandLine = '';
  switch (manifest.files[0].platform) {
    case 'darwin':
      // Find Default Xocde toolchain if swift version equals to requested
      // we should avoid install action and return Xcode default toolchain as toolPath.
      commandLine = path.join(
        toolchains.getXcodeDefaultToolchain(),
        '/usr/bin/swift'
      );
      toolPath = toolchains.getXcodeDefaultToolchain();
      break;
    case 'ubuntu':
      commandLine = '/usr/bin/swift';
      toolPath = '/';
      break;
    case 'centos':
    case 'amazonlinux':
      commandLine = '/usr/lib/swift';
      toolPath = '/';
      break;
    default:
      break;
  }

  if (fs.existsSync(commandLine)) {
    const { stdout } = await exec.getExecOutput(commandLine, ['--version']);
    if (
      utils.getVersion(stdout) ==
      manifest.version.replace(re.SWIFT_RELEASE, '$1')
    ) {
      return toolPath;
    }
  }

  core.info(`Version ${manifest.version} was not found in the local cache`);
  return '';
}
