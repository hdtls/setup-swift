import * as core from '@actions/core';
import os from 'os';
import * as mm from './manifest';
import * as finder from './finder';
import * as installer from './installer';
import * as utils from './utils';

export async function run() {
  try {
    const versipnSpec = core.getInput('swift-version', { required: true });
    const arch = core.getInput('architecture') || os.arch();

    if (versipnSpec.length === 0) {
      core.setFailed('Missing `swift-version`.');
    }

    const platform = os.platform();

    // TODO: resolve win32 version id
    const manifest = mm.resolve(
      versipnSpec,
      platform == 'linux' ? utils.getLinuxDistribID() : platform,
      arch,
      platform == 'linux'
        ? utils.getLinuxDistribRelease()
        : platform == 'darwin'
        ? ''
        : '10'
    );

    let toolPath = finder.findSwift(manifest);

    if (!toolPath) {
      await installer.install(manifest);
    }

    toolPath = finder.findSwift(manifest);

    if (!toolPath) {
      throw new Error(
        [
          `Version ${versipnSpec} with platform ${
            platform == 'linux' ? utils.getLinuxDistribID() : platform
          } not found`,
          `The list of all available versions can be found here: https://www.swift.org/download`
        ].join(os.EOL)
      );
    }

    await installer.exportVariables(manifest, toolPath);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
