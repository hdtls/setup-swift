import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';
import * as tc from '../tool-cache';
import * as toolchains from '../toolchains';
import * as utils from '../utils';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
export async function install(manifest: tc.IToolRelease) {
  const release = manifest.files[0];
  let archivePath = await tc.downloadTool(release.download_url);
  archivePath = await tc.extractXar(archivePath);
  const extractPath = await tc.extractTar(
    path.join(archivePath, `${manifest.version}-osx-package.pkg`, 'Payload')
  );

  await tc.cacheDir(extractPath, 'swift', manifest.version);
}

/**
 * Export path or any other relative variables
 *
 * @param manifest manifest for installed tool
 * @param toolPath installed tool path
 */
export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  // Remove /usr/bin
  toolPath = toolPath.split('/').slice(0, -2).join('/');

  // Toolchains located in:
  //   /Library/Developer/Toolchains
  //   /Users/runner/Library/Developer/Toolchains
  //   /Applications/Xcode.app/Contents/Developer/Toolchains
  // are not maintained by setup-swift.
  if (
    !toolPath.startsWith(toolchains.getXcodeDefaultToolchainsDirectory()) &&
    !toolPath.startsWith(toolchains.getSystemToolchainsDirectory()) &&
    !toolPath.startsWith(toolchains.getToolchainsDirectory())
  ) {
    if (!fs.existsSync(toolchains.getToolchainsDirectory())) {
      await io.mkdirP(toolchains.getToolchainsDirectory());
    }

    const toolchain = toolchains.getToolchain(manifest.version);
    if (fs.existsSync(toolchain)) {
      await io.rmRF(toolchain);
    }

    // Remove swift-latest.xctoolchain
    if (fs.existsSync(toolchains.getToolchain('swift-latest'))) {
      await io.rmRF(toolchains.getToolchain('swift-latest'));
    }

    fs.symlinkSync(toolPath, toolchain);
  }

  const TOOLCHAINS = toolchains.parseBundleIDFromDirectory(toolPath);

  core.debug(`export TOOLCHAINS environment variable: ${TOOLCHAINS}`);
  core.exportVariable('TOOLCHAINS', TOOLCHAINS);
  core.setOutput('TOOLCHAINS', TOOLCHAINS);

  toolPath = path.join(toolPath, '/usr/bin');
  const commandLine = path.join(toolPath, 'swift');
  const args = ['--version'];
  const options: exec.ExecOptions = { silent: true };
  const { stdout } = await exec.getExecOutput(commandLine, args, options);

  const swiftVersion = utils.extractVerFromLogMessage(stdout);

  core.addPath(toolPath);
  core.setOutput('swift-path', path.join(toolPath, 'swift'));
  core.setOutput('swift-version', swiftVersion);
  core.info(`Successfully set up Swift ${swiftVersion} (${manifest.version})`);
}
