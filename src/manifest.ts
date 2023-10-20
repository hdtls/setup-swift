import * as tc from './tool-cache';
import * as fs from 'fs';
import { re, src, t, coerce } from './re';

/**
 *  Resolve tool manifest from given tag platform arch and platform version
 *
 * @param versionSpec     input tag of tool
 * @param platform
 * @param architecture
 * @param platformVersion optionala platform version
 * @returns
 */
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

  switch (true) {
    case re[t.SWIFTNIGHTLY].test(versionSpec):
      SWIFT_BRANCH = `swift-${versionSpec.replace(
        re[t.SWIFTNIGHTLY],
        '$1'
      )}-branch`;
      break;
    case re[t.SWIFTNIGHTLYLOOSE].test(versionSpec):
      SWIFT_BRANCH = `swift-${versionSpec.replace(
        re[t.SWIFTNIGHTLYLOOSE],
        '$1'
      )}-branch`;
      break;
    case re[t.SWIFTMAINLINENIGHTLY].test(versionSpec):
      SWIFT_BRANCH = 'development';
      break;
    default:
      SWIFT_BRANCH = SWIFT_VERSION.toLowerCase();
      break;
  }

  const _SWIFT_PLATFORM = SWIFT_PLATFORM.replace('.', '');

  return {
    version: SWIFT_VERSION,
    stable: re[t.SWIFTRELEASE].test(SWIFT_VERSION),
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

/**
 * Resolve latest build version tag from give tag and platform
 *
 * @param versionSpec tag of the tool
 * @param platform    resolved platform
 * @returns
 */
export async function resolveLatestBuildIfNeeded(
  versionSpec: string,
  platform: string
): Promise<string> {
  let branch = '';
  switch (true) {
    case new RegExp(`^${src[t.MAINVERSION]}$`).test(versionSpec):
    case new RegExp(`^${src[t.NUMERICIDENTIFIER]}$`).test(versionSpec):
      if (!tc.isExplicitVersion(versionSpec)) {
        versionSpec = tc.evaluateVersions(SWIFT_VERSIONS, versionSpec);
        // If patch version is 0 remove it.
        versionSpec = versionSpec.replace(/([0-9]+\.[0-9]+).0/, '$1');
      }
      return `swift-${versionSpec}-RELEASE`;
    case re[t.SWIFTRELEASE].test(versionSpec):
      const m = versionSpec.match(re[t.SWIFTRELEASE]) || [];
      if (tc.isExplicitVersion(m[1])) {
        return versionSpec;
      }
      versionSpec = tc.evaluateVersions(SWIFT_VERSIONS, m[1]);
      // If patch version is 0 remove it.
      versionSpec = versionSpec.replace(/([0-9]+\.[0-9]+).0/, '$1');
      return `swift-${versionSpec}-RELEASE`;
    case re[t.SWIFTNIGHTLY].test(versionSpec):
    case re[t.SWIFTNIGHTLYLOOSE].test(versionSpec):
    case re[t.SWIFTMAINLINENIGHTLY].test(versionSpec):
      let branch = '';
      if (re[t.SWIFTNIGHTLY].test(versionSpec)) {
        branch = `swift-${versionSpec.replace(
          re[t.SWIFTNIGHTLY],
          '$1'
        )}-branch`;
      } else if (re[t.SWIFTNIGHTLYLOOSE].test(versionSpec)) {
        branch = `swift-${versionSpec.replace(
          re[t.SWIFTNIGHTLYLOOSE],
          '$1'
        )}-branch`;
      } else {
        branch = 'development';
      }
      const url = `https://download.swift.org/${branch}/${platform}/latest-build.yml`;
      const path = await tc.downloadTool(url);
      return fs.existsSync(path)
        ? fs
            .readFileSync(path)
            .toString()
            .match(/dir: ?(?<version>.*)/)?.groups?.version || ''
        : '';
    default:
      throw new Error(
        `Cannot create release file for an unsupported version: ${versionSpec}`
      );
  }
}

// Also update Github actions integration-tests if needed.
const SWIFT_VERSIONS = [
  '5.9.1',
  '5.9',
  '5.8.1',
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
].map(e => coerce(e));
