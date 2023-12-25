import * as mm from '../src/manifest';
import fs from 'fs';
import * as tc from '../src/tool-cache';

jest.spyOn(fs, 'existsSync').mockReturnValue(true);
jest.spyOn(tc, 'downloadTool').mockReturnValue(Promise.resolve(''));

describe('manifest', () => {
  describe('test resolve latest build version', () => {
    it.each([
      ['swift-5.7.1-RELEASE', 'swift-5.7.1-RELEASE'],
      ['swift-5.7-RELEASE', 'swift-5.7.3-RELEASE'],
      ['5.7.1', 'swift-5.7.1-RELEASE'],
      ['5.7', 'swift-5.7.3-RELEASE'],
      ['5', 'swift-5.9.2-RELEASE']
    ])('for %s', async (versionSpec, expected) => {
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
    ])('for %s', async (versionSpec, expected) => {
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
    ])('for %s', async (versionSpec, expected) => {
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
  });

  describe.each(['5.7.1', 'swift-5.7.1-RELEASE'])(
    'test resolve release file for explicit stable version %s',
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
    'test resolve release file for most recent patch version %s',
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
    'test resolve release file for most recent minor version %s',
    versionSpec => {
      it.each(['x64', 'arm64'])('on darwin %s', async arch => {
        const actual = await mm.resolve(versionSpec, 'darwin', arch);
        const expected = {
          version: 'swift-5.9.2-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: 'swift-5.9.2-RELEASE-osx.pkg',
              platform: 'darwin',
              download_url: `https://download.swift.org/swift-5.9.2-release/xcode/swift-5.9.2-RELEASE/swift-5.9.2-RELEASE-osx.pkg`,
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
          version: 'swift-5.9.2-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: `swift-5.9.2-RELEASE-ubuntu22.04${
                arch == 'arm64' ? '-aarch64' : ''
              }.tar.gz`,
              platform: 'ubuntu',
              download_url: `https://download.swift.org/swift-5.9.2-release/ubuntu2204${
                arch == 'arm64' ? '-aarch64' : ''
              }/swift-5.9.2-RELEASE/swift-5.9.2-RELEASE-ubuntu22.04${
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

  describe.each(['nightly-5.7', 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a'])(
    'test resolve release file for most recent nightly version %s',
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
    'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'
  ])(
    'test resolve release file for most recent mainline nightly version %s',
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
