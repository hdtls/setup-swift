import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';
import * as gpg from './gpg';
import * as tc from './tool-cache';
import * as utils from './utils';
import * as toolchains from './toolchains';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
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

/**
 * Export path or any other relative variables
 *
 * on macOS this also create symblink for installed toolchains
 *
 * @param manifest manifest for installed tool
 * @param toolPath installed tool path
 */
export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  let commandLine = '';
  let args: string[] | undefined;

  switch (manifest.files[0].platform) {
    case 'darwin':
      // Remove /usr/bin
      toolPath = toolPath.split('/').slice(0, -2).join('/');

      // Toolchains located in:
      //   /Library/Developer/Toolchains
      //   /Users/runner/Library/Developer/Toolchains
      //   /Applications/Xcode.app/Contents/Developer/Toolchains
      // are not maintained by setup-swift.
      if (
        !toolPath.startsWith(toolchains.getXcodeDefaultToolchain()) &&
        !toolPath.startsWith('/Library/Developer/Toolchains') &&
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
      commandLine = 'xcrun';
      args = ['swift', '--version'];
      break;
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
      commandLine = path.join(toolPath, 'swift');
      args = ['--version'];
      break;
    default:
      throw new Error(
        `Installing Swift on ${manifest.files[0].platform} is not supported yet`
      );
  }

  const options: exec.ExecOptions = { silent: true };
  const { stdout } = await exec.getExecOutput(commandLine, args, options);

  const swiftVersion = utils.extractVerFromLogMessage(stdout);

  core.addPath(toolPath);
  core.setOutput('swift-path', path.join(toolPath, 'swift'));
  core.setOutput('swift-version', swiftVersion);
  core.info(`Successfully set up Swift ${swiftVersion} (${manifest.version})`);
}
