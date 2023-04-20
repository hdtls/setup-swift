import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';
import fs from 'fs';
import os from 'os';
import * as installer from '../src/installer';
import { IToolRelease } from '../src/tool-cache';
import * as toolchains from '../src/toolchains';

const SWIFT_VERSION = '5.7.3';
const TOOLCHAINS = 'org.swift.573202201171a';
const contents = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Aliases</key>
	<array>
		<string>swift</string>
	</array>
	<key>CFBundleIdentifier</key>
	<string>${TOOLCHAINS}</string>
	<key>CompatibilityVersion</key>
	<integer>2</integer>
	<key>CompatibilityVersionDisplayString</key>
	<string>Xcode 8.0</string>
	<key>CreatedDate</key>
	<date>2023-01-15T23:17:44Z</date>
	<key>DisplayName</key>
	<string>Swift 5.7.3 Release 2022-01-17 (a)</string>
	<key>OverrideBuildSettings</key>
	<dict>
		<key>ENABLE_BITCODE</key>
		<string>NO</string>
		<key>SWIFT_DEVELOPMENT_TOOLCHAIN</key>
		<string>YES</string>
		<key>SWIFT_DISABLE_REQUIRED_ARCLITE</key>
		<string>YES</string>
		<key>SWIFT_LINK_OBJC_RUNTIME</key>
		<string>YES</string>
		<key>SWIFT_USE_DEVELOPMENT_TOOLCHAIN_RUNTIME</key>
		<string>YES</string>
	</dict>
	<key>ReportProblemURL</key>
	<string>https://bugs.swift.org/</string>
	<key>ShortDisplayName</key>
	<string>Swift 5.7.3 Release</string>
	<key>Version</key>
	<string>5.7.3.20220117101</string>
</dict>
</plist>
`;

describe('installer', () => {
  let stdoutSpy: jest.SpyInstance;
  let coreInfoSpy: jest.SpyInstance;
  let coreDebugSpy: jest.SpyInstance;
  let getExecOutput: jest.SpyInstance;

  beforeEach(() => {
    console.log('::stop-commands::stoptoken'); // Disable executing of runner commands when running tests in actions
    process.env['GITHUB_ENV'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    process.env['GITHUB_PATH'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    process.env['GITHUB_OUTPUT'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out

    stdoutSpy = jest.spyOn(process.stdout, 'write');
    coreInfoSpy = jest.spyOn(core, 'info');
    coreDebugSpy = jest.spyOn(core, 'debug');
    getExecOutput = jest.spyOn(exec, 'getExecOutput');
    getExecOutput.mockResolvedValue({
      stdout: `Swift version 5.7.3 (swift-5.7.3-RELEASE)
    Target: x86_64-unknown-linux-gnu`,
      exitCode: 0,
      stderr: ''
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    console.log('::stoptoken::'); // Re-enable executing of runner commands when running tests in actions
  });

  function _getManifest(
    platform: string,
    version?: string,
    stable?: boolean,
    arch?: string,
    platformVersion?: string
  ): IToolRelease {
    return {
      version: version || 'swift-5.7.3-RELEASE',
      stable: stable !== undefined ? stable : true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: platform,
          download_url: '',
          arch: arch || 'x64',
          platform_version: platformVersion
        }
      ]
    };
  }

  function _assertExportVariables(toolPath: string, version?: string) {
    expect(stdoutSpy).toHaveBeenCalledWith(`::add-path::${toolPath}${os.EOL}`);
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-path::${path.join(toolPath, 'swift')}${os.EOL}`
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-version::${version || SWIFT_VERSION}${os.EOL}`
    );
    expect(coreInfoSpy).toHaveBeenCalledWith(
      `Successfully set up Swift ${version || SWIFT_VERSION} (swift-${
        version || SWIFT_VERSION
      }-RELEASE)`
    );
  }

  it('install on unsupported platform', async () => {
    const platform = 'unsupported';
    const manifest = _getManifest(platform);

    await expect(installer.install(manifest)).rejects.toThrow(
      `Installing Swift on ${platform} is not supported yet`
    );
  });

  it('export variables for unsupported platform', async () => {
    const platform = 'unsupported';
    const manifest = _getManifest(platform);

    await expect(
      installer.exportVariables(manifest, __dirname)
    ).rejects.toThrow(`Installing Swift on ${platform} is not supported yet`);
  });

  it.each(['amazonlinux', 'centos', 'ubuntu'])(
    'export variables for %s',
    async platform => {
      const manifest = _getManifest(platform);

      await installer.exportVariables(manifest, __dirname);

      _assertExportVariables(__dirname);
    }
  );

  describe('export variables for darwin', () => {
    let existsSpy: jest.SpyInstance;
    let readFileSpy: jest.SpyInstance;
    let symlinkSpy: jest.SpyInstance;
    let mkdirPSpy: jest.SpyInstance;
    let rmRFSpy: jest.SpyInstance;

    beforeEach(() => {
      existsSpy = jest.spyOn(fs, 'existsSync');
      existsSpy.mockReturnValue(true);
      readFileSpy = jest.spyOn(fs, 'readFileSync');
      readFileSpy.mockReturnValue(contents);
      symlinkSpy = jest.spyOn(fs, 'symlinkSync');
      symlinkSpy.mockImplementation(() => {});
      mkdirPSpy = jest.spyOn(io, 'mkdirP');
      mkdirPSpy.mockImplementation(
        () =>
          new Promise<void>((resolve, reject) => {
            resolve(void 0);
          })
      );
      rmRFSpy = jest.spyOn(io, 'rmRF');
      rmRFSpy.mockImplementation(
        () =>
          new Promise<void>((resolve, reject) => {
            resolve(void 0);
          })
      );
      jest
        .spyOn(toolchains, 'getToolchainsDirectory')
        .mockReturnValue(path.join(__dirname, 'TEMP'));
    });

    function _assertExportVariablesOnDarwin(toolPath: string) {
      expect(coreDebugSpy).toHaveBeenCalledWith(
        `export TOOLCHAINS environment variable: ${TOOLCHAINS}`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::debug::export TOOLCHAINS environment variable: ${TOOLCHAINS}${os.EOL}`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::set-env name=TOOLCHAINS::${TOOLCHAINS}${os.EOL}`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::set-output name=TOOLCHAINS::${TOOLCHAINS}${os.EOL}`
      );
      _assertExportVariables(toolPath);
    }

    describe('unmaintained', () => {
      it.each([
        [
          '/Library/Developer/Toolchains',
          path.join(
            toolchains.getSystemToolchainsDirectory(),
            '/swift-5.7.3-RELEASE/usr/bin'
          )
        ],
        [
          'Users/[runner]/Library/Developer/Toolchains',
          path.join(
            __dirname,
            'TEMP',
            '/swift-5.7.1-RELEASE.xctoolchain/usr/bin'
          )
        ],
        [
          'Xcode default toolchains',
          path.join(
            toolchains.getXcodeDefaultToolchainsDirectory(),
            '/swift-5.7.3-RELEASE/usr/bin'
          )
        ]
      ])('toolchain is in the %s', async (scope, toolchain) => {
        const toolPath = toolchain.split('/').slice(0, -2).join('/');
        const expectedToolPath = path.join(toolPath, '/usr/bin');
        const manifest = _getManifest('darwin');

        await installer.exportVariables(manifest, toolchain);

        expect(existsSpy).toHaveBeenCalledTimes(1);
        expect(mkdirPSpy).toHaveBeenCalledTimes(0);
        expect(rmRFSpy).toHaveBeenCalledTimes(0);
        expect(symlinkSpy).toHaveBeenCalledTimes(0);
        _assertExportVariablesOnDarwin(expectedToolPath);
      });
    });

    describe('maintained (tool cache)', () => {
      describe('user toolchains does not exists', () => {
        it('should create user toolchains directory', async () => {
          const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
          const manifest = _getManifest('darwin');
          const toolPath = toolchain.split('/').slice(0, -2).join('/');
          const expectedToolPath = path.join(toolPath, '/usr/bin');

          // user toolchains dir not exists so subdir is the same.
          existsSpy
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false);

          await installer.exportVariables(manifest, toolchain);

          expect(existsSpy).toHaveBeenCalledTimes(4);
          expect(mkdirPSpy).toHaveBeenCalledTimes(1);
          expect(rmRFSpy).toHaveBeenCalledTimes(0);
          expect(symlinkSpy).toHaveBeenCalledTimes(1);
          _assertExportVariablesOnDarwin(expectedToolPath);
        });
      });

      describe('user toolchains exists', () => {
        it('toolchain with same version exists swift-latest symblink does not exists', async () => {
          const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
          const manifest = _getManifest('darwin');
          const toolPath = toolchain.split('/').slice(0, -2).join('/');
          const expectedToolPath = path.join(toolPath, '/usr/bin');

          existsSpy
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);

          await installer.exportVariables(manifest, toolchain);

          expect(existsSpy).toHaveBeenCalledTimes(4);
          expect(mkdirPSpy).toHaveBeenCalledTimes(0);
          expect(rmRFSpy).toHaveBeenCalledTimes(1);
          expect(symlinkSpy).toHaveBeenCalledTimes(1);
          _assertExportVariablesOnDarwin(expectedToolPath);
        });

        it('toolchain with same version exists swift-latest symblink also exists', async () => {
          const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
          const manifest = _getManifest('darwin');
          const toolPath = toolchain.split('/').slice(0, -2).join('/');
          const expectedToolPath = path.join(toolPath, '/usr/bin');

          existsSpy
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);

          await installer.exportVariables(manifest, toolchain);

          expect(existsSpy).toHaveBeenCalledTimes(4);
          expect(mkdirPSpy).toHaveBeenCalledTimes(0);
          expect(rmRFSpy).toHaveBeenCalledTimes(2);
          expect(symlinkSpy).toHaveBeenCalledTimes(1);
          _assertExportVariablesOnDarwin(expectedToolPath);
        });

        it('toolchain with same version does not exists but swift-latest symblink exists', async () => {
          const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
          const manifest = _getManifest('darwin');
          const toolPath = toolchain.split('/').slice(0, -2).join('/');
          const expectedToolPath = path.join(toolPath, '/usr/bin');

          existsSpy
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

          await installer.exportVariables(manifest, toolchain);

          expect(existsSpy).toHaveBeenCalledTimes(4);
          expect(mkdirPSpy).toHaveBeenCalledTimes(0);
          expect(rmRFSpy).toHaveBeenCalledTimes(1);
          expect(symlinkSpy).toHaveBeenCalledTimes(1);
          _assertExportVariablesOnDarwin(expectedToolPath);
        });

        it('both toolchain with same version and swift-latest symblink does not exists', async () => {
          const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
          const manifest = _getManifest('darwin');
          const toolPath = toolchain.split('/').slice(0, -2).join('/');
          const expectedToolPath = path.join(toolPath, '/usr/bin');

          existsSpy
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false);

          await installer.exportVariables(manifest, toolchain);

          expect(existsSpy).toHaveBeenCalledTimes(4);
          expect(mkdirPSpy).toHaveBeenCalledTimes(0);
          expect(rmRFSpy).toHaveBeenCalledTimes(0);
          expect(symlinkSpy).toHaveBeenCalledTimes(1);
          _assertExportVariablesOnDarwin(expectedToolPath);
        });
      });
    });
  });
});
