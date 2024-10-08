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
      ['5', 'swift-5.10.1-RELEASE']
    ])('from numeric version: %s', async (versionSpec, expected) => {
      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    it.each([
      ['swift-5.7.1-RELEASE', 'swift-5.7.1-RELEASE'],
      ['swift-5.7-RELEASE', 'swift-5.7-RELEASE'],
      [
        'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
        'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a'
      ],
      [
        'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a',
        'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'
      ]
    ])('from tag: %s', async (versionSpec, expected) => {
      const actual = await mm.resolveLatestBuildIfNeeded(versionSpec, 'xcode');
      expect(actual).toBe(expected);
    });

    it.each([
      ['nightly', 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'],
      ['nightly-main', 'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a']
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

    it('from nightly tag: nightly-5.7', async () => {
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

      const actual = await mm.resolveLatestBuildIfNeeded(
        'nightly-5.7',
        'xcode'
      );
      expect(actual).toBe('swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a');
    });

    it.each(['5.7.1.1', 'swift-RELEASE'])(
      'from unsupported input: %s',
      async versionSpec => {
        await expect(
          mm.resolveLatestBuildIfNeeded(versionSpec, 'ubuntu2204')
        ).rejects.toThrow(
          `Cannot create release file for an unsupported version: ${versionSpec}`
        );
      }
    );
  });

  describe.each(['5.7.1', 'swift-5.7.1-RELEASE'])(
    'test resolve manifest from explicit version e.g. %s',
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

  describe('test resolve manifest from explicit version e.g. swift-5.7-RELEASE', () => {
    it.each(['x64', 'arm64'])('on darwin %s', async arch => {
      const actual = await mm.resolve('swift-5.7-RELEASE', 'darwin', arch);
      const expected = {
        version: 'swift-5.7-RELEASE',
        stable: true,
        release_url: '',
        files: [
          {
            filename: 'swift-5.7-RELEASE-osx.pkg',
            platform: 'darwin',
            download_url: `https://download.swift.org/swift-5.7-release/xcode/swift-5.7-RELEASE/swift-5.7-RELEASE-osx.pkg`,
            arch: arch,
            platform_version: undefined
          }
        ]
      };
      expect(actual).toStrictEqual(expected);
    });

    it.each(['x64', 'arm64'])('on ubuntu %s', async arch => {
      const actual = await mm.resolve(
        'swift-5.7-RELEASE',
        'ubuntu',
        arch,
        '22.04'
      );
      const expected = {
        version: 'swift-5.7-RELEASE',
        stable: true,
        release_url: '',
        files: [
          {
            filename: `swift-5.7-RELEASE-ubuntu22.04${
              arch == 'arm64' ? '-aarch64' : ''
            }.tar.gz`,
            platform: 'ubuntu',
            download_url: `https://download.swift.org/swift-5.7-release/ubuntu2204${
              arch == 'arm64' ? '-aarch64' : ''
            }/swift-5.7-RELEASE/swift-5.7-RELEASE-ubuntu22.04${
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

  describe('test resolve manifest from most recent minor version e.g. 5.7', () => {
    it.each(['x64', 'arm64'])('on darwin %s', async arch => {
      const actual = await mm.resolve('5.7', 'darwin', arch);
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
      const actual = await mm.resolve('5.7', 'ubuntu', arch, '22.04');
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
  });

  describe.each(['5'])(
    'test resolve manifest from most recent major version %s',
    versionSpec => {
      const lts = 'swift-5.10.1-RELEASE';
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: lts,
          stable: true,
          release_url: '',
          files: [
            {
              filename: `${lts}-osx.pkg`,
              platform: 'darwin',
              download_url: `https://download.swift.org/${lts.toLowerCase()}/xcode/${lts}/${lts}-osx.pkg`,
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
          version: lts,
          stable: true,
          release_url: '',
          files: [
            {
              filename: `${lts}-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/${lts.toLowerCase()}/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/${lts}/${lts}-ubuntu22.04${
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

  describe('test resolve manifest from nightly versions', () => {
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

      const actual = await mm.resolve('nightly-5.7', 'darwin', arch);
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

      const actual = await mm.resolve('nightly-5.7', 'ubuntu', arch, '22.04');
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
  });

  describe.each(['nightly', 'nightly-main'])(
    'test resolve manifest from mainline nightly version %s',
    versionSpec => {
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
    }
  );
});
