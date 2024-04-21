import * as tc from '@actions/tool-cache';
import * as mm from '../src/manifest';
import fs from 'fs';

jest.spyOn(fs, 'existsSync').mockReturnValue(true);
jest.spyOn(tc, 'downloadTool').mockReturnValue(Promise.resolve(''));

describe('manifest', () => {
  describe('test resolveLatestBuildIfNeeded', () => {
    it.each([
      ['5.7.1', 'swift-5.7.1-RELEASE'],
      ['5.7', 'swift-5.7.3-RELEASE'],
      ['5', 'swift-5.10-RELEASE']
    ])('from stable version: %s', async (versionSpec, expected) => {
      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    it.each([
      ['swift-5.7.1-RELEASE', 'swift-5.7.1-RELEASE'],
      ['swift-5.7-RELEASE', 'swift-5.7.3-RELEASE']
    ])('from swift release tag: %s', async (versionSpec, expected) => {
      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    it.each([
      ['nightly', 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'],
      ['nightly-main', 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'],
      [
        'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a',
        'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'
      ]
    ])('from mainline nightly tag: %s', async (versionSpec, expected) => {
      jest.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(`date: 2023-04-11 10:10:00-06:00
dir: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a
download: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04.tar.gz
download_signature: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04.tar.gz.sig
name: Swift Development Snapshot
`);

      expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
      expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
      expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    it.each([
      ['nightly-5.7', 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a'],
      [
        'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
        'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a'
      ]
    ])('from nightly tag: %s', async (versionSpec, expected) => {
      jest.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(`date: 2022-10-03 10:10:00-06:00
dir: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a
download: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04.tar.gz
download_signature: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04.tar.gz.sig
name: Swift Development Snapshot
`);

      expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
      expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
      expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    //download.swift.org/swift-6.0-branch/ubuntu2204/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-18-a/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-18-a-ubuntu22.04.tar.gz -o /home/runner/work/_temp/swift.tar.gz https://download.swift.org/swift-6.0-branch/ubuntu2204/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-18-a/swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-18-a-ubuntu22.04.tar.gz.sig -o /home/runner/work/_temp/swift.tar.gz.sig

    https: it.each(['5.7.1.1', 'swift-RELEASE'])(
      'from unsupported input: %s',
      async versionSpec => {
        try {
          await mm.resolveLatestBuildIfNeeded(versionSpec, 'ubuntu2204');
        } catch (error) {
          if (error instanceof Error) {
            expect(error.message).toBe(
              `Cannot create release file for an unsupported version: ${versionSpec}`
            );
          } else {
            fail('should throw error');
          }
        }
      }
    );
  });

  describe.each(['5.7.1', 'swift-5.7.1-RELEASE'])(
    'test resolve manifest from explicit stable version: %s',
    versionSpec => {
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: 'swift-5.7.1-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: 'swift-5.7.1-RELEASE-osx.pkg',
              platform: 'darwin',
              download_url: `https://download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg`,
              arch: arch,
              platform_version: undefined
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });

      it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'ubuntu', arch, '22.04');
        const expected = {
          version: 'swift-5.7.1-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: `swift-5.7.1-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/swift-5.7.1-release/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              arch: arch,
              platform_version: '22.04'
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });
    }
  );

  describe.each(['5.7', 'swift-5.7-RELEASE'])(
    'test resolve manifest from most recent minor version: %s',
    versionSpec => {
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: 'swift-5.7.3-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: 'swift-5.7.3-RELEASE-osx.pkg',
              platform: 'darwin',
              download_url: `https://download.swift.org/swift-5.7.3-release/xcode/swift-5.7.3-RELEASE/swift-5.7.3-RELEASE-osx.pkg`,
              arch: arch,
              platform_version: undefined
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });

      it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'ubuntu', arch, '22.04');
        const expected = {
          version: 'swift-5.7.3-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: `swift-5.7.3-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/swift-5.7.3-release/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/swift-5.7.3-RELEASE/swift-5.7.3-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              arch: arch,
              platform_version: '22.04'
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });
    }
  );

  describe.each(['5'])(
    'test resolve manifest from most recent major version %s',
    versionSpec => {
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: 'swift-5.10-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: 'swift-5.10-RELEASE-osx.pkg',
              platform: 'darwin',
              download_url: `https://download.swift.org/swift-5.10-release/xcode/swift-5.10-RELEASE/swift-5.10-RELEASE-osx.pkg`,
              arch: arch,
              platform_version: undefined
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });

      it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'ubuntu', arch, '22.04');
        const expected = {
          version: 'swift-5.10-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: `swift-5.10-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/swift-5.10-release/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/swift-5.10-RELEASE/swift-5.10-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              arch: arch,
              platform_version: '22.04'
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });
    }
  );

  describe.each(['nightly-5.7', 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-01-a'])(
    'test resolve manifest from nightly version %s',
    versionSpec => {
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValueOnce(`date: 2022-10-03 10:10:00-06:00
debug_info: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx-symbols.pkg
dir: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a
download: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg
name: Swift Development Snapshot
`);

        expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
        expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
        expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
          stable: false,
          release_url: '',
          files: [
            {
              filename: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg',
              platform: 'darwin',
              download_url: `https://download.swift.org/swift-5.7-branch/xcode/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-osx.pkg`,
              arch: arch,
              platform_version: undefined
            }
          ]
        };

        expect(actual).toStrictEqual(expected);
      });

      it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValueOnce(`date: 2022-10-03 10:10:00-06:00
dir: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a
download: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04${
          arch == 'arm64' ? '-aarch64' : ''
        }.tar.gz
download_signature: swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04${
          arch == 'arm64' ? '-aarch64' : ''
        }.tar.gz.sig
name: Swift Development Snapshot
`);

        expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
        expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
        expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

        const actual = await mm.resolve(versionSpec, 'ubuntu', arch, '22.04');
        const expected = {
          version: 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
          stable: false,
          release_url: '',
          files: [
            {
              filename: `swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/swift-5.7-branch/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a/swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              arch: arch,
              platform_version: '22.04'
            }
          ]
        };
        expect(actual).toStrictEqual(expected);
      });
    }
  );

  describe.each([
    'nightly',
    'nightly-main',
    'swift-DEVELOPMENT-SNAPSHOT-2023-04-10-a'
  ])('test resolve manifest from mainline nightly version %s', versionSpec => {
    it.each(['x64', 'arm64'])('on darwin %s', async arch => {
      jest.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(`date: 2022-10-03 10:10:00-06:00
debug_info: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-osx-symbols.pkg
dir: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a
download: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-osx.pkg
name: Swift Development Snapshot
`);

      expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
      expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
      expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

      const actual = await mm.resolve(versionSpec, 'darwin', arch);
      const expected = {
        version: 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a',
        stable: false,
        release_url: '',
        files: [
          {
            filename: 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-osx.pkg',
            platform: 'darwin',
            download_url: `https://download.swift.org/development/xcode/swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a/swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-osx.pkg`,
            arch: arch,
            platform_version: undefined
          }
        ]
      };

      expect(actual).toStrictEqual(expected);
    });

    it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
      jest.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(`date: 2023-04-11 10:10:00-06:00
dir: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a
download: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04${
        arch == 'arm64' ? '-aarch64' : ''
      }.tar.gz
download_signature: swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04${
        arch == 'arm64' ? '-aarch64' : ''
      }.tar.gz.sig
name: Swift Development Snapshot
`);

      expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
      expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
      expect(jest.isMockFunction(tc.downloadTool)).toBeTruthy();

      const actual = await mm.resolve(versionSpec, 'ubuntu', arch, '22.04');
      const expected = {
        version: 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a',
        stable: false,
        release_url: '',
        files: [
          {
            filename: `swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04${
              arch == 'arm64' ? '-aarch64' : ''
            }.tar.gz`,
            platform: 'ubuntu',
            download_url: `https://download.swift.org/development/ubuntu2204${
              arch == 'arm64' ? '-aarch64' : ''
            }/swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a/swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a-ubuntu22.04${
              arch == 'arm64' ? '-aarch64' : ''
            }.tar.gz`,
            arch: arch,
            platform_version: '22.04'
          }
        ]
      };
      expect(actual).toStrictEqual(expected);
    });
  });
});
