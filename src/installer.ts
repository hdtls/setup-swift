import * as tc from './tool-cache';
import * as amazonlinux from './installers/amazonlinux';
import * as centos from './installers/centos';
import * as darwin from './installers/darwin';
import * as ubuntu from './installers/ubuntu';

/**
 * Download and install tools define in release file
 *
 * @param tag the swift vertion tag
 * @param release release file, contains filename platform platform_version arch and download_url
 */
export async function install(tag: string, release: tc.IToolReleaseFile) {
  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.install(tag, release);
      break;
    case 'centos':
      await centos.install(tag, release);
      break;
    case 'darwin':
      await darwin.install(tag, release);
      break;
    case 'ubuntu':
      await ubuntu.install(tag, release);
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
 * @param tag the swift version tag
 * @param release release file, contains install metadatas
 * @param toolPath installed tool path
 */
export async function exportVariables(
  tag: string,
  release: tc.IToolReleaseFile,
  toolPath: string
) {
  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.exportVariables(tag, toolPath);
      break;
    case 'centos':
      await centos.exportVariables(tag, toolPath);
      break;
    case 'darwin':
      await darwin.exportVariables(tag, toolPath);
      break;
    case 'ubuntu':
      await ubuntu.exportVariables(tag, toolPath);
      break;
    default:
      throw new Error(
        `Installing Swift on ${release.platform} is not supported yet`
      );
  }
}
