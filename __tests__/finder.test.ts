import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'path';
import fs from 'fs';
import * as finder from '../src/finder';
import * as tc from '../src/tool-cache';
import * as io from '@actions/io';

describe('finder', () => {
  let findInPathSpy: jest.SpyInstance;
  let getExecOutputSpy: jest.SpyInstance;
  let tcfindSpy: jest.SpyInstance;
  let readdirSpy: jest.SpyInstance;

  beforeEach(() => {
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

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('unstable versions finding', () => {
    it.each([
      'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a',
      'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a'
    ])('found cached tool for %s', async versionSpec => {
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

      tcfindSpy.mockReturnValueOnce(__dirname);
      const expected = path.join(__dirname, '/usr/bin');
      expect(await finder.find(manifest)).toEqual(expected);
      expect(findInPathSpy).toHaveBeenCalledTimes(0);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    });

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
      expect(findInPathSpy).toHaveBeenCalledTimes(0);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('stable versions finding', () => {
    it.each(['ubuntu', 'centos', 'amazonlinux'])(
      '[%s] that does not have swift installed',
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
        const actual = await finder.find(manifest);

        // Should not enter in to darwin handler
        expect(readdirSpy).toHaveBeenCalledTimes(0);
        expect(findInPathSpy).toHaveBeenCalled();
        expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
        expect(tcfindSpy).toHaveBeenCalled();
        expect(actual).toEqual('');
      }
    );

    it.each(['ubuntu', 'centos', 'amazonlinux'])(
      '[%s] with swift installed but version mismatch',
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

        expect(readdirSpy).toHaveBeenCalledTimes(0);
        expect(findInPathSpy).toHaveBeenCalled();
        expect(getExecOutputSpy).toHaveBeenCalled();
        expect(tcfindSpy).toHaveBeenCalled();
        expect(actual).toEqual('');
      }
    );

    it.each(['ubuntu', 'centos', 'amazonlinux'])(
      '[%s] where swift is installed and the version matches',
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

        expect(readdirSpy).toHaveBeenCalledTimes(0);
        expect(findInPathSpy).toHaveBeenCalled();
        expect(getExecOutputSpy).toHaveBeenCalled();
        // Cached tool find in /usr/local/bin return immediatly return,
        // so tc.find will not be called
        expect(tcfindSpy).toHaveBeenCalledTimes(0);
        expect(actual).toEqual('/usr/local/bin');
      }
    );
  });
});
