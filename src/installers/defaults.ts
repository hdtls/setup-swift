import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as gpg from '../gpg';
import * as tc from '../tool-cache';
import * as utils from '../utils';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
export async function install(manifest: tc.IToolRelease) {
  const release = manifest.files[0];

  const signatureUrl = release.download_url + '.sig';
  const [archivePath, signature] = await Promise.all([
    tc.downloadTool(release.download_url),
    tc.downloadTool(signatureUrl)
  ]);

  await gpg.importKeys();
  await gpg.verify(signature, archivePath);

  let extractPath = await tc.extractTar(archivePath);
  extractPath = path.join(extractPath, release.filename.replace('.tar.gz', ''));

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
  let commandLine = '';
  let args: string[] | undefined;
  commandLine = path.join(toolPath, 'swift');
  args = ['--version'];

  const options: exec.ExecOptions = { silent: true };
  const { stdout } = await exec.getExecOutput(commandLine, args, options);

  const swiftVersion = utils.extractVerFromLogMessage(stdout);

  core.addPath(toolPath);
  core.setOutput('swift-path', path.join(toolPath, 'swift'));
  core.setOutput('swift-version', swiftVersion);
  core.info(`Successfully set up Swift ${swiftVersion} (${manifest.version})`);
}
