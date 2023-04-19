import * as tc from './tool-cache';
import * as amazonlinux from './installers/amazonlinux';
import * as centos from './installers/centos';
import * as darwin from './installers/darwin';
import * as ubuntu from './installers/ubuntu';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
export async function install(manifest: tc.IToolRelease) {
  const release = manifest.files[0];

  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.install(manifest);
      break;
    case 'centos':
      await centos.install(manifest);
      break;
    case 'darwin':
      await darwin.install(manifest);
      break;
    case 'ubuntu':
      await ubuntu.install(manifest);
      break;
    default:
      throw new Error(
        `Installing Swift on ${release.platform} is not supported yet`
      );
  }
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
  const release = manifest.files[0];

  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.exportVariables(manifest, toolPath);
      break;
    case 'centos':
      await centos.exportVariables(manifest, toolPath);
      break;
    case 'darwin':
      await darwin.exportVariables(manifest, toolPath);
      break;
    case 'ubuntu':
      await ubuntu.exportVariables(manifest, toolPath);
      break;
    default:
      throw new Error(
        `Installing Swift on ${release.platform} is not supported yet`
      );
  }
}
