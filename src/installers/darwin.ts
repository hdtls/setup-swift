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
  // Toolchains located in:
  //   /Library/Developer/Toolchains
  //   /Users/runner/Library/Developer/Toolchains
  //   /Applications/Xcode.app/Contents/Developer/Toolchains
  // are not maintained by setup-swift.
  const systemLibrary = toolchains.getSystemToolchainsDirectory()
  const userLibrary = toolchains.getToolchainsDirectory()
  const xcodeLibrary = toolchains.getXcodeDefaultToolchainsDirectory()

  if (
    !toolPath.startsWith(systemLibrary) &&
    !toolPath.startsWith(userLibrary) &&
    !toolPath.startsWith(xcodeLibrary)
  ) {
    if (!fs.existsSync(userLibrary)) {
      await io.mkdirP(userLibrary);
    }

    const toolchain = toolchains.getToolchain(version);
    if (fs.existsSync(toolchain)) {
      // Replace with tool-cache cached toolchain.
      await io.rmRF(toolchain);
    }

    // Remove swift-latest.xctoolchain
    if (fs.existsSync(toolchains.getToolchain('swift-latest'))) {
      await io.rmRF(toolchains.getToolchain('swift-latest'));
    }

    fs.symlinkSync(toolPath, toolchain);
  }

  // Remove last to path components so we can access Info.plist file.
  const plistPath = toolPath.split('/').slice(0, -2).join('/')
  const TOOLCHAINS = toolchains.parseBundleIDFromDirectory(plistPath);

  core.debug(`export TOOLCHAINS environment variable: ${TOOLCHAINS}`);
  core.exportVariable('TOOLCHAINS', TOOLCHAINS);
  core.setOutput('TOOLCHAINS', TOOLCHAINS);

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
