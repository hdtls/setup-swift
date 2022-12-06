import { resolve } from '../src/manifest';
import fs from 'fs';
import * as tc from '../src/tool-cache';

jest.spyOn(fs, 'existsSync').mockReturnValue(true);
jest.spyOn(tc, 'downloadTool').mockReturnValue(Promise.resolve(''));

describe('manifest', () => {
  describe.each(['5.7.1', '5.7', 'swift-5.7.1-RELEASE', 'swift-5.7-RELEASE'])(
    'resolve stable version %s',
    versionSpec => {
      it.each([
        { platform: 'darwin', architecture: 'x64' },
        { platform: 'ubuntu', architecture: 'x64', platformVersion: '22.04' },
        {
          platform: 'ubuntu',
          architecture: 'arm64',
          platformVersion: '22.04'
        },
        { platform: 'win32', architecture: 'x64', platformVersion: '10' }
      ])(
        'on $platform $architecture',
        async ({ platform, architecture, platformVersion }) => {
          const actual = await resolve(
            versionSpec,
            platform,
            architecture,
            platformVersion
          );

          let SWIFT_VERSION = /^swift-(\d+.\d+(.\d+)?)-RELEASE$/.test(
            versionSpec
          )
            ? versionSpec
            : `swift-${versionSpec}-RELEASE`;
          let SWIFT_BRANCH = SWIFT_VERSION.toLowerCase();
          let SWIFT_PLATFORM = '';
          let filename = '';

          switch (platform) {
            case 'darwin':
              filename = `${SWIFT_VERSION}-osx.pkg`;
              SWIFT_PLATFORM = 'xcode';
              break;
            case 'win32':
              filename = `${SWIFT_VERSION}-windows${platformVersion}.exe`;
              SWIFT_PLATFORM = `windows${platformVersion?.replace('.', '')}`;
              break;
            default:
              filename =
                architecture == 'arm64'
                  ? `${SWIFT_VERSION}-${platform}${platformVersion}-aarch64.tar.gz`
                  : `${SWIFT_VERSION}-${platform}${platformVersion}.tar.gz`;
              SWIFT_PLATFORM =
                architecture == 'arm64'
                  ? `${platform}${platformVersion?.replace('.', '')}-aarch64`
                  : `${platform}${platformVersion?.replace('.', '')}`;
              break;
          }

          const expected = {
            version: SWIFT_VERSION,
            stable: true,
            release_url: '',
            files: [
              {
                filename: filename,
                platform: platform,
                download_url: `https://download.swift.org/${SWIFT_BRANCH}/${SWIFT_PLATFORM}/${SWIFT_VERSION}/${filename}`,
                arch: architecture,
                platform_version: platformVersion
              }
            ]
          };
          expect(actual).toStrictEqual(expected);
        }
      );
    }
  );

  describe.each([
    'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
    'swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a',
    'nightly-5.7',
    'nightly-main'
  ])('resolve nightly version %s', versionSpec => {
    it.each([
      { platform: 'darwin', architecture: 'x64' },
      { platform: 'ubuntu', architecture: 'x64', platformVersion: '22.04' },
      {
        platform: 'ubuntu',
        architecture: 'arm64',
        platformVersion: '22.04'
      },
      { platform: 'win32', architecture: 'x64', platformVersion: '10' }
    ])(
      'on $platform $architecture',
      async ({ platform, architecture, platformVersion }) => {
        if (
          /^swift-DEVELOPMENT-.+/.test(versionSpec) ||
          /^nightly-main$/.test(versionSpec)
        ) {
          jest.spyOn(fs, 'readFileSync')
            .mockReturnValueOnce(`date: 2022-12-05 10:10:00-06:00
debug_info: swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a-osx-symbols.pkg
dir: swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a
download: swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a-osx.pkg
name: Swift Development Snapshot
`);
        } else {
          jest.spyOn(fs, 'readFileSync')
            .mockReturnValueOnce(`date: 2022-10-03 10:10:00-06:00
debug_info: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx-symbols.pkg
dir: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a
download: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg
name: Swift Development Snapshot
`);
        }

        const actual = await resolve(
          versionSpec,
          platform,
          architecture,
          platformVersion
        );

        let SWIFT_VERSION = /^swift(-(\d+.\d+(.\d+)?))?-DEVELOPMENT-.+-a/.test(
          versionSpec
        )
          ? versionSpec
          : /^nightly-main$/.test(versionSpec)
          ? 'swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a'
          : 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a';

        let SWIFT_BRANCH = /^swift-(\d+.\d+)-DEVELOPMENT-.+-a/.test(
          SWIFT_VERSION
        )
          ? `swift-${SWIFT_VERSION.replace(
              /^swift-(\d+.\d+)-DEVELOPMENT-.+-a$/,
              '$1'
            )}-branch`
          : 'development';
        let SWIFT_PLATFORM = '';
        let filename = '';

        switch (platform) {
          case 'darwin':
            filename = `${SWIFT_VERSION}-osx.pkg`;
            SWIFT_PLATFORM = 'xcode';
            break;
          case 'win32':
            filename = `${SWIFT_VERSION}-windows${platformVersion}.exe`;
            SWIFT_PLATFORM = `windows${platformVersion?.replace('.', '')}`;
            break;
          default:
            filename =
              architecture == 'arm64'
                ? `${SWIFT_VERSION}-${platform}${platformVersion}-aarch64.tar.gz`
                : `${SWIFT_VERSION}-${platform}${platformVersion}.tar.gz`;
            SWIFT_PLATFORM =
              architecture == 'arm64'
                ? `${platform}${platformVersion?.replace('.', '')}-aarch64`
                : `${platform}${platformVersion?.replace('.', '')}`;
            break;
        }

        const expected = {
          version: SWIFT_VERSION,
          stable: false,
          release_url: '',
          files: [
            {
              filename: filename,
              platform: platform,
              download_url: `https://download.swift.org/${SWIFT_BRANCH}/${SWIFT_PLATFORM}/${SWIFT_VERSION}/${filename}`,
              arch: architecture,
              platform_version: platformVersion
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      }
    );
  });
});
