import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as gpg from './gpg';
import * as tc from './tool-cache';
import * as utils from './utils';
import * as toolchains from './toolchains';

export async function install(manifest: tc.IToolRelease) {
  assert.ok(/^swift-/.test(manifest.version));

  let archivePath = '';
  let extractPath = '';

  const release = manifest.files[0];

  switch (release.platform) {
    case 'darwin':
      archivePath = await tc.downloadTool(release.download_url);
      archivePath = await tc.extractXar(archivePath);
      extractPath = await tc.extractTar(
        path.join(archivePath, `${manifest.version}-osx-package.pkg`, 'Payload')
      );
      break;
    case 'linux':
      const signatureUrl = release.download_url + '.sig';
      const [targz, signature] = await Promise.all([
        tc.downloadTool(release.download_url),
        tc.downloadTool(signatureUrl)
      ]);

      archivePath = targz;

      await gpg.importKeys();
      await gpg.verify(signature, archivePath);

      extractPath = await tc.extractTar(archivePath);
      extractPath = path.join(
        extractPath,
        release.filename.replace('.tar.gz', '')
      );
      break;
    default:
      throw new Error('Unsupported');
  }

  await tc.cacheDir(extractPath, 'swift', manifest.version);
}

export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  assert.ok(/^swift-/.test(manifest.version));

  let SWIFT_VERSION = '';

  switch (os.platform()) {
    case 'darwin':
      const TOOLCHAINS = toolchains.parseBundleIDFromDirectory(toolPath);

      const xctoolchain = path.join(toolchains.getToolchain(manifest.version));
      if (fs.existsSync(xctoolchain)) {
        await io.rmRF(xctoolchain);
      }

      if (fs.existsSync(toolchains.getToolchain('swift-latest'))) {
        await io.rmRF(toolchains.getToolchain('swift-latest'));
      }

      // Xcode only recognize toolchains that located in Library/Developer/Toolchains
      fs.symlinkSync(toolPath, xctoolchain);

      core.debug(`export TOOLCHAINS environment variable: ${TOOLCHAINS}`);

      SWIFT_VERSION = (
        await exec.getExecOutput('xcrun', [
          '--toolchain',
          `${TOOLCHAINS}`,
          '--run',
          'swift',
          '--version'
        ])
      ).stdout;

      core.exportVariable('TOOLCHAINS', TOOLCHAINS);
      core.setOutput('TOOLCHAINS', TOOLCHAINS);
      break;
    case 'linux':
      SWIFT_VERSION = (
        await exec.getExecOutput(path.join(toolPath, '/usr/bin/swift'), [
          '--version'
        ])
      ).stdout;
      break;
    default:
      throw new Error('Unsupported');
  }

  SWIFT_VERSION = utils.getVersion(SWIFT_VERSION);

  core.addPath(path.join(toolPath, '/usr/bin'));
  core.setOutput('swift-path', path.join(toolPath, '/usr/bin/swift'));
  core.setOutput('swift-version', SWIFT_VERSION);
  core.info('');
  core.info(`Successfully set up Swift (${SWIFT_VERSION})`);
}
