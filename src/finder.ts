import * as core from '@actions/core';
import * as exec from '@actions/exec';
import path from 'path';
import * as fs from 'fs';
import * as tc from './tool-cache';
import * as toolchains from './toolchains';
import * as utils from './utils';

export async function find(manifest: tc.IToolRelease) {
  let re = /^swift-(\d+\.\d+(\.\d+)?)-RELEASE$/;
  let toolPath = '';

  // Find Default Xocde toolchain if swift version equals to requested
  // we should avoid install action just return Xcode default toolchain as toolPath.
  if ((process.platform == 'darwin', re.test(manifest.version))) {
    const commandLine = path.join(
      toolchains.getXcodeDefaultToolchain(),
      '/usr/bin/swift'
    );
    if (fs.existsSync(commandLine)) {
      const { stdout } = await exec.getExecOutput(commandLine, ['--version']);
      if (utils.getVersion(stdout) == manifest.version.replace(re, '$1')) {
        return toolchains.getXcodeDefaultToolchain();
      }
    }
  }

  toolPath = tc.find('swift', manifest.version);

  if (toolPath) {
    return toolPath;
  }

  core.info(`Version ${manifest.version} was not found in the local cache`);
  return '';
}
