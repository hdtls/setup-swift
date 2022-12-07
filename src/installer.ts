import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import fs from 'fs';
import path from 'path';
import * as gpg from './gpg';
import * as tc from './tool-cache';
import * as utils from './utils';
import * as toolchains from './toolchains';

export async function install(manifest: tc.IToolRelease) {
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
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
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
      throw new Error(
        `Installing Swift on ${release.platform} is not supported yet`
      );
  }

  await tc.cacheDir(extractPath, 'swift', manifest.version);
}

export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  let message = '';

  switch (manifest.files[0].platform) {
    case 'darwin':
      if (toolPath != toolchains.getXcodeDefaultToolchain()) {
        if (!fs.existsSync(toolchains.getToolchainsDirectory())) {
          await io.mkdirP(toolchains.getToolchainsDirectory());
        }

        const xctoolchain = path.join(
          toolchains.getToolchain(manifest.version)
        );
        if (fs.existsSync(xctoolchain)) {
          await io.rmRF(xctoolchain);
        }

        if (fs.existsSync(toolchains.getToolchain('swift-latest'))) {
          await io.rmRF(toolchains.getToolchain('swift-latest'));
        }

        // Xcode only recognize toolchains that located in Library/Developer/Toolchains
        fs.symlinkSync(toolPath, xctoolchain);
      }

      const TOOLCHAINS = toolchains.parseBundleIDFromDirectory(toolPath);

      core.debug(`export TOOLCHAINS environment variable: ${TOOLCHAINS}`);

      message = (
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
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
      message = (
        await exec.getExecOutput(path.join(toolPath, '/usr/bin/swift'), [
          '--version'
        ])
      ).stdout;
      break;
    default:
      throw new Error(
        `Installing Swift on ${manifest.files[0].platform} is not supported yet`
      );
  }

  const swiftVersion = utils.getVersion(message);

  core.addPath(path.join(toolPath, '/usr/bin'));
  core.setOutput('swift-path', path.join(toolPath, '/usr/bin/swift'));
  core.setOutput('swift-version', swiftVersion);
  core.info(`Successfully set up Swift ${swiftVersion} (${manifest.version})`);
}
