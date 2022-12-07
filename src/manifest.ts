import * as tc from './tool-cache';
import * as fs from 'fs';

export async function resolve(
  versionSpec: string,
  platform: string,
  architecture: string,
  platformVersion?: string
): Promise<tc.IToolRelease> {
  let SWIFT_VERSION = versionSpec;
  let SWIFT_BRANCH = '';

  if (/^\d+\.\d+(\.\d+)?$/.test(versionSpec)) {
    SWIFT_BRANCH = `swift-${versionSpec}-release`;
    SWIFT_VERSION = `swift-${versionSpec}-RELEASE`;
  } else if (
    /^swift-DEVELOPMENT-.+-a$/.test(versionSpec) ||
    /^nightly-main$/.test(versionSpec)
  ) {
    SWIFT_BRANCH = 'development';
  } else if (/^swift-\d+\.\d+(\.\d+)?-RELEASE$/.test(versionSpec)) {
    SWIFT_BRANCH = versionSpec.toLowerCase();
  } else if (/^swift-(\d+\.\d+(\.\d+)?)-DEVELOPMENT-.+-a$/.test(versionSpec)) {
    SWIFT_BRANCH = `swift-${versionSpec.replace(
      /^swift-(\d+\.\d+(\.\d+)?)-DEVELOPMENT-.+-a$/,
      '$1'
    )}-branch`;
  } else if (/^nightly-(\d+.\d+)$/.test(versionSpec)) {
    SWIFT_BRANCH = `swift-${versionSpec.replace(
      /^nightly-(\d+.\d+)$/,
      '$1'
    )}-branch`;
  } else {
    throw new Error(
      `Cannot create release file for an unsupported version: ${versionSpec}`
    );
  }

  let SWIFT_PLATFORM = '';
  let filename = '';

  switch (platform) {
    case 'darwin':
      SWIFT_PLATFORM = 'xcode';
      SWIFT_VERSION = await resolveLatestBuildIfPossible(
        SWIFT_VERSION,
        SWIFT_BRANCH,
        SWIFT_PLATFORM
      );
      filename = `${SWIFT_VERSION}-osx.pkg`;
      break;
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
      SWIFT_PLATFORM = `${platform}${platformVersion || ''}${
        architecture == 'arm64' ? '-aarch64' : ''
      }`;
      SWIFT_VERSION = await resolveLatestBuildIfPossible(
        SWIFT_VERSION,
        SWIFT_BRANCH,
        SWIFT_PLATFORM.replace('.', '')
      );
      filename = `${SWIFT_VERSION}-${SWIFT_PLATFORM}.tar.gz`;
      break;
    case 'win32':
      SWIFT_PLATFORM = `windows${platformVersion || ''}`;
      SWIFT_VERSION = await resolveLatestBuildIfPossible(
        SWIFT_VERSION,
        SWIFT_BRANCH,
        SWIFT_PLATFORM.replace('.', '')
      );
      filename = `${SWIFT_VERSION}-${SWIFT_PLATFORM}.exe`;
      break;
    default:
      throw new Error('Cannot create release file for an unsupported OS');
  }

  const _SWIFT_PLATFORM = SWIFT_PLATFORM.replace('.', '');

  return {
    version: SWIFT_VERSION,
    stable: /^swift-\d+\.\d+(\.\d+)?-RELEASE$/.test(SWIFT_VERSION),
    release_url: '',
    files: [
      {
        filename: filename,
        platform: platform,
        platform_version: platformVersion,
        arch: architecture,
        download_url: `https://download.swift.org/${SWIFT_BRANCH}/${_SWIFT_PLATFORM}/${SWIFT_VERSION}/${filename}`
      }
    ]
  };
}

async function resolveLatestBuildIfPossible(
  versionSpec: string,
  branch: string,
  platform: string
) {
  if (/^(development|swift-\d+.\d+-branch)$/.test(branch)) {
    const url = `https://download.swift.org/${branch}/${platform}/latest-build.yml`;
    const path = await tc.downloadTool(url);
    return fs.existsSync(path)
      ? fs
          .readFileSync(path)
          .toString()
          .match(/dir: ?(?<version>.*)/)?.groups?.version || ''
      : '';
  } else {
    return versionSpec;
  }
}
