import * as tc from '@actions/tool-cache';
import * as amazonlinux from './installers/amazonlinux';
import * as centos from './installers/centos';
import * as darwin from './installers/darwin';
import * as ubuntu from './installers/ubuntu';

/**
 * Download and install tools define in release file
 *
 * @param version the swift vertion
 * @param release release file, contains filename platform platform_version arch and download_url
 */
export async function install(version: string, release: tc.IToolReleaseFile) {
  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.install(version, release);
      break;
    case 'centos':
      await centos.install(version, release);
      break;
    case 'darwin':
      await darwin.install(version, release);
      break;
    case 'ubuntu':
      await ubuntu.install(version, release);
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
 * @param version the swift version tag
 * @param release release file, contains install metadatas
 * @param toolPath installed tool path
 */
export async function exportVariables(
  version: string,
  release: tc.IToolReleaseFile,
  toolPath: string
) {
  switch (release.platform) {
    case 'amazonlinux':
      await amazonlinux.exportVariables(version, toolPath);
      break;
    case 'centos':
      await centos.exportVariables(version, toolPath);
      break;
    case 'darwin':
      await darwin.exportVariables(version, toolPath);
      break;
    case 'ubuntu':
      await ubuntu.exportVariables(version, toolPath);
      break;
    default:
      throw new Error(
        `Export Swift variables on ${release.platform} is not supported yet`
      );
  }
}
