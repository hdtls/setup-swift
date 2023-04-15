import * as tc from './tool-cache';
import * as fs from 'fs';
import * as re from './re';
import * as semver from 'semver';

export async function resolve(
  versionSpec: string,
  platform: string,
  architecture: string,
  platformVersion?: string
): Promise<tc.IToolRelease> {
  let SWIFT_VERSION = '';
  let SWIFT_PLATFORM = '';
  let filename = '';
  let SWIFT_BRANCH = '';

  switch (platform) {
    case 'darwin':
      SWIFT_PLATFORM = 'xcode';
      SWIFT_VERSION = await resolveLatestBuildIfNeeded(
        versionSpec,
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
      SWIFT_VERSION = await resolveLatestBuildIfNeeded(
        versionSpec,
        SWIFT_PLATFORM.replace('.', '')
      );
      filename = `${SWIFT_VERSION}-${SWIFT_PLATFORM}.tar.gz`;
      break;
    case 'win32':
      SWIFT_PLATFORM = `windows${platformVersion || ''}`;
      SWIFT_VERSION = await resolveLatestBuildIfNeeded(
        SWIFT_VERSION,
        SWIFT_PLATFORM.replace('.', '')
      );
      filename = `${SWIFT_VERSION}-${SWIFT_PLATFORM}.exe`;
      break;
    default:
      throw new Error('Cannot create release file for an unsupported OS');
  }

  if (re.SWIFT_NIGHTLY.test(SWIFT_VERSION)) {
    SWIFT_BRANCH = `swift-${versionSpec.replace(
      re.SWIFT_NIGHTLY,
      '$2'
    )}-branch`;
  } else if (re.SWIFT_MAINLINE_NIGHTLY.test(SWIFT_VERSION)) {
    SWIFT_BRANCH = 'development';
  } else {
    SWIFT_BRANCH = SWIFT_VERSION.toLowerCase();
  }

  const _SWIFT_PLATFORM = SWIFT_PLATFORM.replace('.', '');

  return {
    version: SWIFT_VERSION,
    stable: re.SWIFT_RELEASE.test(SWIFT_VERSION),
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

export async function resolveLatestBuildIfNeeded(
  versionSpec: string,
  platform: string
): Promise<string> {
  if (re.SWIFT_SEMANTIC_VERSION.test(versionSpec)) {
    if (!tc.isExplicitVersion(versionSpec)) {
      versionSpec = tc.evaluateVersions(SWIFT_VERSIONS, versionSpec);
      // If patch version is 0 remove it.
      versionSpec = versionSpec.replace(/(\d+\.\d+).0/, '$1');
    }
    return `swift-${versionSpec}-RELEASE`;
  } else if (re.SWIFT_RELEASE.test(versionSpec)) {
    const m = versionSpec.match(re.SWIFT_RELEASE) || [];
    if (tc.isExplicitVersion(m[1])) {
      return versionSpec;
    }
    versionSpec = tc.evaluateVersions(SWIFT_VERSIONS, m[1]);
    // If patch version is 0 remove it.
    versionSpec = versionSpec.replace(/(\d+\.\d+).0/, '$1');
    return `swift-${versionSpec}-RELEASE`;
  } else if (
    re.SWIFT_NIGHTLY.test(versionSpec) ||
    re.SWIFT_MAINLINE_NIGHTLY.test(versionSpec)
  ) {
    const branch = re.SWIFT_MAINLINE_NIGHTLY.test(versionSpec)
      ? 'development'
      : `swift-${versionSpec.replace(re.SWIFT_NIGHTLY, '$2')}-branch`;
    const url = `https://download.swift.org/${branch}/${platform}/latest-build.yml`;
    const path = await tc.downloadTool(url);
    return fs.existsSync(path)
      ? fs
          .readFileSync(path)
          .toString()
          .match(/dir: ?(?<version>.*)/)?.groups?.version || ''
      : '';
  } else {
    throw new Error(
      `Cannot create release file for an unsupported version: ${versionSpec}`
    );
  }
}

// Also update Github actions integration-tests if needed.
const SWIFT_VERSIONS = [
  '5.8',
  '5.7.3',
  '5.7.2',
  '5.7.1',
  '5.7',
  '5.6.3',
  '5.6.2',
  '5.6.1',
  '5.6',
  '5.5.3',
  '5.5.2',
  '5.5.1',
  '5.5'
].map(e => semver.coerce(e)!.version);
