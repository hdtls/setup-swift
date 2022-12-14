import * as core from '@actions/core';
import os from 'os';
import * as mm from './manifest';
import * as finder from './finder';
import * as installer from './installer';
import * as utils from './utils';

export async function run() {
  try {
    const versionSpec = core.getInput('swift-version', { required: true });
    const arch = core.getInput('architecture') || process.arch;

    if (versionSpec.length === 0) {
      core.setFailed('Missing `swift-version`.');
    }

    const manifest = await mm.resolve(
      versionSpec,
      process.platform == 'linux'
        ? utils.getLinuxDistribID()
        : process.platform,
      arch,
      process.platform == 'linux'
        ? utils.getLinuxDistribRelease()
        : process.platform == 'darwin'
        ? ''
        : '10'
    );

    let toolPath = await finder.find(manifest);

    if (!toolPath) {
      await installer.install(manifest);
      toolPath = await finder.find(manifest);
    }

    if (!toolPath) {
      throw new Error(
        [
          `Version ${versionSpec} with platform ${
            process.platform == 'linux'
              ? utils.getLinuxDistribID()
              : process.platform
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
