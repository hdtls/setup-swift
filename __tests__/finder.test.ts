import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';
import fs from 'fs';
import * as finder from '../src/finder';
import * as tc from '@actions/tool-cache';
import * as toolchains from '../src/toolchains';

const systemLibrary = path.join(__dirname, 'TEMP', 'System');
const userLibrary = path.join(__dirname, 'TEMP', 'User');
const xcodeLibrary = path.join(__dirname, 'TEMP', 'Xcode');

describe('finder', () => {
  let findInPathSpy: jest.SpyInstance;
  let getExecOutputSpy: jest.SpyInstance;
  let tcfindSpy: jest.SpyInstance;
  let readdirSpy: jest.SpyInstance;

  beforeEach(async () => {
    await io.mkdirP(systemLibrary);
    await io.mkdirP(userLibrary);
    await io.mkdirP(xcodeLibrary);

    jest
      .spyOn(toolchains, 'getSystemToolchainsDirectory')
      .mockReturnValue(systemLibrary);
    jest
      .spyOn(toolchains, 'getToolchainsDirectory')
      .mockReturnValue(userLibrary);
    jest
      .spyOn(toolchains, 'getXcodeDefaultToolchainsDirectory')
      .mockReturnValue(xcodeLibrary);

    findInPathSpy = jest.spyOn(io, 'findInPath').mockResolvedValue([]);
    getExecOutputSpy = jest.spyOn(exec, 'getExecOutput').mockResolvedValue({
      stdout: `Swift version 5.8 (swift-5.8-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
      exitCode: 0,
      stderr: ''
    });
    tcfindSpy = jest.spyOn(tc, 'find').mockReturnValue('');
    readdirSpy = jest.spyOn(fs, 'readdirSync');
  });

  afterEach(async () => {
    await io.rmRF(systemLibrary);
    await io.rmRF(userLibrary);
    await io.rmRF(xcodeLibrary);

    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await io.rmRF(path.join(__dirname, 'TEMP'));
  });

  describe('find unstable versions', () => {
    it.each([
      'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
      'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'
    ])('cached tool for %s not found', async versionSpec => {
      const manifest = {
        version: versionSpec,
        stable: false,
        release_url: '',
        files: [
          {
            filename: '',
            platform: 'ubuntu',
            download_url: '',
            arch: 'arm64',
            platform_version: undefined
          }
        ]
      };

      expect(await finder.find(manifest)).toEqual('');
      expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('find stable versions', () => {
    it.each(['darwin', 'ubuntu', 'centos', 'amazonlinux'])(
      'on [%s] that does not have swift installed',
      async platform => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        // darwin only
        jest.spyOn(fs, 'lstatSync').mockImplementationOnce(() => {
          throw new Error('no such file or directory');
        });

        const manifest = {
          version: 'swift-5.8-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: '',
              platform: platform,
              download_url: '',
              arch: '',
              platform_version: undefined
            }
          ]
        };
        const actual = await finder.find(manifest);

        if (platform == 'darwin') {
          expect(findInPathSpy).toHaveBeenCalledTimes(0);
        } else {
          expect(findInPathSpy).toHaveBeenCalled();
        }
        expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
        expect(actual).toEqual('');
      }
    );

    it.each(['ubuntu', 'centos', 'amazonlinux'])(
      'on [%s] with swift installed but version mismatch',
      async () => {
        const manifest = {
          version: 'swift-5.8-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: '',
              platform: 'ubuntu',
              download_url: '',
              arch: '',
              platform_version: undefined
            }
          ]
        };

        const toolPaths = ['/usr/bin', '/usr/local/bin'];
        findInPathSpy.mockResolvedValueOnce(toolPaths);
        getExecOutputSpy
          .mockResolvedValueOnce({
            stdout: `Swift version 5.7.3 (swift-5.7.3-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
            exitCode: 0,
            stderr: ''
          })
          .mockResolvedValueOnce({
            stdout: `Swift version 5.7.1 (swift-5.7.1-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
            exitCode: 0,
            stderr: ''
          });

        const actual = await finder.find(manifest);

        expect(findInPathSpy).toHaveBeenCalled();
        expect(getExecOutputSpy).toHaveBeenCalledTimes(2);
        expect(actual).toEqual('');
      }
    );

    it('on [darwin] with swift installed but version mismatch', async () => {
      // After each test userLibrary will be remove so we don't need remove subdirectory
      await io.mkdirP(
        path.join(userLibrary, 'swift-5.7.3-RELEASE.xctoolchain')
      );

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      getExecOutputSpy.mockResolvedValueOnce({
        stdout: `Apple Swift version 5.7.3 (swift-5.7.3-RELEASE)
Target: x86_64-apple-macosx12.0`,
        exitCode: 0,
        stderr: ''
      });

      const manifest = {
        version: 'swift-5.8-RELEASE',
        stable: true,
        release_url: '',
        files: [
          {
            filename: '',
            platform: 'darwin',
            download_url: '',
            arch: '',
            platform_version: undefined
          }
        ]
      };
      const actual = await finder.find(manifest);

      expect(findInPathSpy).toHaveBeenCalledTimes(0);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(1);
      expect(actual).toEqual('');
    });

    it.each(['darwin', 'ubuntu', 'centos', 'amazonlinux'])(
      'on [%s] with matched swift installed in toolcache',
      () => {
        tcfindSpy.mockReturnValue('/opt/hostedtoolcache/swift/5.10.0/x64');
        const manifest = {
          version: 'swift-5.10-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: '',
              platform: 'ubuntu',
              download_url: '',
              arch: '',
              platform_version: undefined
            }
          ]
        };
        const toolPath = finder.find(manifest);
        expect(findInPathSpy).toHaveBeenCalledTimes(0);
        expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
        expect(toolPath).toBe('/opt/hostedtoolcache/swift/5.10.0/x64/usr/bin');
      }
    );

    it.each(['ubuntu', 'centos', 'amazonlinux'])(
      'on [%s] with matched swift installed out of toolcache',
      async platform => {
        const manifest = {
          version: 'swift-5.8-RELEASE',
          stable: true,
          release_url: '',
          files: [
            {
              filename: '',
              platform: platform,
              download_url: '',
              arch: '',
              platform_version: undefined
            }
          ]
        };

        const toolPaths = ['/usr/bin/swift', '/usr/local/bin/swift'];
        findInPathSpy.mockResolvedValueOnce(toolPaths);
        getExecOutputSpy.mockResolvedValueOnce({
          stdout: `Swift version 5.7.3 (swift-5.7.3-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
          exitCode: 0,
          stderr: ''
        });

        const actual = await finder.find(manifest);

        expect(findInPathSpy).toHaveBeenCalled();
        expect(getExecOutputSpy).toHaveBeenCalled();
        // Cached tool find in /usr/local/bin return immediatly return,
        // so tc.find will not be called
        expect(actual).toEqual('/usr/local/bin');
      }
    );

    it('on [darwin] with matched swift installed out of toolcache', async () => {
      await io.mkdirP(path.join(userLibrary, 'swift-5.8-RELEASE.xctoolchain'));

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      getExecOutputSpy.mockResolvedValueOnce({
        stdout: `Apple Swift version 5.8 (swift-5.8-RELEASE)
Target: x86_64-apple-macosx12.0`,
        exitCode: 0,
        stderr: ''
      });

      const manifest = {
        version: 'swift-5.8-RELEASE',
        stable: true,
        release_url: '',
        files: [
          {
            filename: '',
            platform: 'darwin',
            download_url: '',
            arch: '',
            platform_version: undefined
          }
        ]
      };
      const actual = await finder.find(manifest);

      expect(findInPathSpy).toHaveBeenCalledTimes(0);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(
        path.join(userLibrary, 'swift-5.8-RELEASE.xctoolchain', '/usr/bin')
      );
    });
  });
});
