import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';
import * as toolchains from '../toolchains';
import * as utils from '../utils';
import * as formatter from '../formatter';

/**
 * Download and install tools define in release file
 *
 * @param version the swift vertion
 * @param release release file, contains filename platform platform_version arch and download_url
 */
export async function install(version: string, release: tc.IToolReleaseFile) {
  let archivePath = await tc.downloadTool(release.download_url);
  archivePath = await tc.extractXar(archivePath);
  const extractPath = await tc.extractTar(
    path.join(
      archivePath,
      `${release.filename.replace('-osx.pkg', '-osx-package.pkg')}`,
      'Payload'
    )
  );

  await tc.cacheDir(extractPath, 'swift', formatter.parse(version));
}

/**
 * Export path or any other relative variables
 *
 * @param version the swift version
 * @param toolPath installed tool path
 */
export async function exportVariables(version: string, toolPath: string) {
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

    const toolchain = toolchains.getToolchain(version);
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
  core.info(`Successfully set up Swift ${swiftVersion} (${version})`);
}
