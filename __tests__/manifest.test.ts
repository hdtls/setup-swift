import { resolve } from '../src/manifest';

describe('manifest', () => {
  describe('resolve', () => {
    describe('with semantic version convitable', () => {
      it.each([
        {
          input: {
            versionSpec: '5.7.1',
            platform: 'darwin',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-osx.pkg',
                platform: 'darwin',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: '5.7.1',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-ubuntu22.04.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/ubuntu2204/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04.tar.gz',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: '5.7.1',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'arm64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/ubuntu2204-aarch64/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz',
                arch: 'arm64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: '5.7.1',
            platform: 'win32',
            platformVersion: '10',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-windows10.exe',
                platform: 'win32',
                platform_version: '10',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/windows10/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-windows10.exe',
                arch: 'x64'
              }
            ]
          }
        }
      ])('on $input.platform $input.architechure', ({ input, expected }) => {
        expect(
          resolve(
            input.versionSpec,
            input.platform as NodeJS.Platform,
            input.architechure,
            input.platformVersion
          )
        ).toEqual(expected);
      });
    });

    describe('with release tag', () => {
      it.each([
        {
          input: {
            versionSpec: 'swift-5.7.1-RELEASE',
            platform: 'darwin',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-osx.pkg',
                platform: 'darwin',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7.1-RELEASE',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-ubuntu22.04.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/ubuntu2204/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04.tar.gz',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7.1-RELEASE',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'arm64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/ubuntu2204-aarch64/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz',
                arch: 'arm64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7.1-RELEASE',
            platform: 'win32',
            platformVersion: '10',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7.1-RELEASE',
            stable: true,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7.1-RELEASE-windows10.exe',
                platform: 'win32',
                platform_version: '10',
                download_url:
                  'https://download.swift.org/swift-5.7.1-release/windows10/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-windows10.exe',
                arch: 'x64'
              }
            ]
          }
        }
      ])('on $input.platform $input.architechure', ({ input, expected }) => {
        expect(
          resolve(
            input.versionSpec,
            input.platform as NodeJS.Platform,
            input.architechure,
            input.platformVersion
          )
        ).toEqual(expected);
      });
    });

    describe('with trunk development (main) snapshot', () => {
      it.each([
        {
          input: {
            versionSpec: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            platform: 'darwin',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-osx.pkg',
                platform: 'darwin',
                download_url:
                  'https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-osx.pkg',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-ubuntu22.04.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/development/ubuntu2204/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-ubuntu22.04.tar.gz',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'arm64'
          },
          expected: {
            version: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-ubuntu22.04-aarch64.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/development/ubuntu2204-aarch64/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-ubuntu22.04-aarch64.tar.gz',
                arch: 'arm64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            platform: 'win32',
            platformVersion: '10',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-windows10.exe',
                platform: 'win32',
                platform_version: '10',
                download_url:
                  'https://download.swift.org/development/windows10/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a/swift-DEVELOPMENT-SNAPSHOT-2022-11-03-a-windows10.exe',
                arch: 'x64'
              }
            ]
          }
        }
      ])('on $input.platform $input.architechure', ({ input, expected }) => {
        expect(
          resolve(
            input.versionSpec,
            input.platform as NodeJS.Platform,
            input.architechure,
            input.platformVersion
          )
        ).toEqual(expected);
      });
    });

    describe('with development snapshot', () => {
      it.each([
        {
          input: {
            versionSpec: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            platform: 'darwin',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg',
                platform: 'darwin',
                download_url:
                  'https://download.swift.org/swift-5.7-branch/xcode/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7-branch/ubuntu2204/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04.tar.gz',
                arch: 'x64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            platform: 'ubuntu',
            platformVersion: '22.04',
            architechure: 'arm64'
          },
          expected: {
            version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04-aarch64.tar.gz',
                platform: 'ubuntu',
                platform_version: '22.04',
                download_url:
                  'https://download.swift.org/swift-5.7-branch/ubuntu2204-aarch64/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04-aarch64.tar.gz',
                arch: 'arm64'
              }
            ]
          }
        },
        {
          input: {
            versionSpec: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            platform: 'win32',
            platformVersion: '10',
            architechure: 'x64'
          },
          expected: {
            version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
            stable: false,
            release_url: '',
            files: [
              {
                filename:
                  'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-windows10.exe',
                platform: 'win32',
                platform_version: '10',
                download_url:
                  'https://download.swift.org/swift-5.7-branch/windows10/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-windows10.exe',
                arch: 'x64'
              }
            ]
          }
        }
      ])('on $input.platform $input.architechure', ({ input, expected }) => {
        expect(
          resolve(
            input.versionSpec,
            input.platform as NodeJS.Platform,
            input.architechure,
            input.platformVersion
          )
        ).toEqual(expected);
      });
    });
  });
});
