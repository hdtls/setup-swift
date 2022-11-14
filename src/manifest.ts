import * as tc from './tool-cache';

export function resolve(
  versionSpec: string,
  platform: string,
  architecture: string,
  platformVersion?: string
): tc.IToolRelease {
  let SWIFT_VERSION = versionSpec;
  let SWIFT_BRANCH = '';

  let re = /^\d+\.\d+(\.\d+)?$/;
  let hasMatch = false;
  if (re.test(versionSpec)) {
    SWIFT_BRANCH = `swift-${versionSpec}-release`;
    SWIFT_VERSION = `swift-${versionSpec}-RELEASE`;
    hasMatch = true;
  }

  re = /^swift-DEVELOPMENT-.+-a$/;
  if (re.test(versionSpec) && !hasMatch) {
    SWIFT_BRANCH = 'development';
    hasMatch = true;
  }

  re = /^swift-\d+\.\d+(\.\d+)?-RELEASE$/;
  if (re.test(versionSpec) && !hasMatch) {
    SWIFT_BRANCH = versionSpec.toLowerCase();
    hasMatch = true;
  }

  re = /^swift-(\d+\.\d+(\.\d+)?)-DEVELOPMENT-.+-a$/;
  if (re.test(versionSpec) && !hasMatch) {
    SWIFT_BRANCH = `swift-${versionSpec.replace(re, '$1')}-branch`;
    hasMatch = true;
  }

  let SWIFT_PLATFORM = '';
  let filename = '';

  switch (platform) {
    case 'darwin':
      SWIFT_PLATFORM = 'xcode';
      filename = `${SWIFT_VERSION}-osx.pkg`;
      break;
    case 'ubuntu':
    case 'centos':
    case 'amazonlinux':
      SWIFT_PLATFORM = `${platform}${platformVersion || ''}${
        architecture == 'arm64' ? '-aarch64' : ''
      }`;
      filename = `${SWIFT_VERSION}-${SWIFT_PLATFORM}.tar.gz`;
      break;
    case 'win32':
      SWIFT_PLATFORM = `windows${platformVersion || ''}`;
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
