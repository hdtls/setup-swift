import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import fs from 'fs';
import os from 'os';
import * as installer from '../src/installer';
import * as amazonlinux from '../src/installers/amazonlinux';
import * as centos from '../src/installers/centos';
import * as darwin from '../src/installers/darwin';
import * as ubuntu from '../src/installers/ubuntu';
import * as linux from '../src/installers/defaults';
import * as gpg from '../src/gpg';
import * as toolchains from '../src/toolchains';

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
const tempDir = path.join(__dirname, 'TEMP');
const cacheDir = path.join(__dirname, 'TOOL_CACHE');
const systemLibrary = path.join(__dirname, 'TEMP', 'System');
const userLibrary = path.join(__dirname, 'TEMP', 'User');
const xcodeLibrary = path.join(__dirname, 'TEMP', 'Xcode');

describe('installers', () => {
  let stdoutSpy: jest.SpyInstance;
  let coreInfoSpy: jest.SpyInstance;
  let coreDebugSpy: jest.SpyInstance;
  let execSpy: jest.SpyInstance;
  let getExecOutput: jest.SpyInstance;
  let downloadToolSpy: jest.SpyInstance;
  let gpgImportKeysSpy: jest.SpyInstance;
  let gpgVerifySpy: jest.SpyInstance;
  let tcExtractTarSpy: jest.SpyInstance;
  let tcExtractXarSpy: jest.SpyInstance;
  let tcCacheDirSpy: jest.SpyInstance;

  beforeAll(async () => {
    console.log('::stop-commands::stoptoken'); // Disable executing of runner commands when running tests in actions
    // This stub will cause test failed with deprecated api error.
    // process.env['GITHUB_ENV'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    // process.env['GITHUB_PATH'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    // process.env['GITHUB_OUTPUT'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out

    await io.mkdirP(tempDir);
    await io.mkdirP(cacheDir);
    await io.mkdirP(path.join(tempDir, 'uncompressed', 'swift-5.7.3-RELEASE'));

    process.env['RUNNER_TEMP'] = tempDir;
    process.env['RUNNER_TOOL_CACHE'] = cacheDir;
  });

  afterAll(async () => {
    console.log('::stoptoken::'); // Re-enable executing of runner commands when running tests in actions

    await io.rmRF(tempDir);
    await io.rmRF(cacheDir);

    process.env['RUNNER_TEMP'] = '';
    process.env['RUNNER_TOOL_CACHE'] = '';
  });

  beforeEach(async () => {
    stdoutSpy = jest.spyOn(process.stdout, 'write');
    coreInfoSpy = jest.spyOn(core, 'info');
    coreDebugSpy = jest.spyOn(core, 'debug');
    execSpy = jest.spyOn(exec, 'exec');
    execSpy.mockImplementation(() => {});
    getExecOutput = jest.spyOn(exec, 'getExecOutput').mockResolvedValue({
      stdout: `Swift version 5.7.3 (swift-5.7.3-RELEASE)
    Target: x86_64-unknown-linux-gnu`,
      exitCode: 0,
      stderr: ''
    });
    downloadToolSpy = jest.spyOn(tc, 'downloadTool');
    downloadToolSpy.mockResolvedValue('');
    gpgImportKeysSpy = jest.spyOn(gpg, 'importKeys');
    gpgImportKeysSpy.mockImplementation(() => {});
    gpgVerifySpy = jest.spyOn(gpg, 'verify');
    gpgVerifySpy.mockImplementation(() => {});
    tcExtractXarSpy = jest.spyOn(tc, 'extractXar').mockResolvedValue('');
    tcExtractTarSpy = jest
      .spyOn(tc, 'extractTar')
      .mockResolvedValue(path.join(tempDir, 'uncompressed'));
    tcCacheDirSpy = jest.spyOn(tc, 'cacheDir');
    jest
      .spyOn(toolchains, 'getSystemToolchainsDirectory')
      .mockReturnValue(systemLibrary);
    jest
      .spyOn(toolchains, 'getToolchainsDirectory')
      .mockReturnValue(userLibrary);
    jest
      .spyOn(toolchains, 'getXcodeDefaultToolchainsDirectory')
      .mockReturnValue(xcodeLibrary);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  function _getReleaseFile(
    platform: string,
    platform_version?: string
  ): tc.IToolReleaseFile {
    return {
      filename: '',
      platform: platform,
      download_url: '',
      arch: 'x64',
      platform_version: platform_version
    };
  }

  function _assertExportVariables(toolPath: string, version: string) {
    // expect(stdoutSpy).toHaveBeenCalledWith(`::add-path::${toolPath}${os.EOL}`);
    // expect(stdoutSpy).toHaveBeenCalledWith(
    //   `::set-output name=swift-path::${path.join(toolPath, 'swift')}${os.EOL}`
    // );
    // expect(stdoutSpy).toHaveBeenCalledWith(
    //   `::set-output name=swift-version::${version}${os.EOL}`
    // );
    expect(coreInfoSpy).toHaveBeenCalledWith(
      `Successfully set up Swift ${version} (swift-${version}-RELEASE)`
    );
  }

  describe('install Swift', () => {
    it('on unsupported platfrom using type erased install', async () => {
      const platform = 'unsupported';
      const release = _getReleaseFile(platform);

      await expect(
        installer.install('swift-5.7.3-RELEASE', release)
      ).rejects.toThrow(`Installing Swift on ${platform} is not supported yet`);
    });

    it.each(['amazonlinux', 'centos', 'ubuntu'])(
      'on [%s] using type erased installer',
      async platform => {
        const release = _getReleaseFile(platform);
        await installer.install('swift-5.7.3-RELEASE', release);
        const dir = path.join(cacheDir, 'swift/5.7.3');
        expect(fs.existsSync(dir)).toBeTruthy();
      }
    );

    it('on [darwin] using type erased installer', async () => {
      const release = _getReleaseFile('darwin');
      await installer.install('swift-5.7.3-RELEASE', release);
      const dir = path.join(cacheDir, 'swift/5.7.3');
      expect(fs.existsSync(dir)).toBeTruthy();

      const toolchain = path.join(
        userLibrary,
        'swift-5.7.3-RELEASE.xctoolchain'
      );
      expect(fs.existsSync(toolchain)).toBeTruthy();
      expect(fs.lstatSync(toolchain).isSymbolicLink()).toBeTruthy();
    });

    it.each([
      ['amazonlinux', amazonlinux],
      ['centos', centos],
      ['ubuntu', ubuntu],
      ['linux', linux]
    ])('using %s installer', async (platform, installer) => {
      const release = _getReleaseFile(platform);
      await installer.install('swift-5.7.3-RELEASE', release);
      const dir = path.join(cacheDir, 'swift/5.7.3');
      expect(fs.existsSync(dir)).toBeTruthy();
    });

    it('using darwin installer', async () => {
      const release = _getReleaseFile('darwin');
      await installer.install('swift-5.7.3-RELEASE', release);
      const dir = path.join(cacheDir, 'swift/5.7.3');
      expect(fs.existsSync(dir)).toBeTruthy();
      const toolchain = path.join(
        userLibrary,
        'swift-5.7.3-RELEASE.xctoolchain'
      );
      expect(fs.existsSync(toolchain)).toBeTruthy();
      expect(fs.lstatSync(toolchain).isSymbolicLink()).toBeTruthy();
    });
  });

  describe('export Swift variables', () => {
    it('on unsupported platform using type erased installer', async () => {
      const platform = 'unsupported';
      const release = _getReleaseFile(platform);

      await expect(
        installer.exportVariables(
          'swift-5.7.3-RELEASE',
          release,
          path.join(cacheDir, 'swift/5.7.3/x64/usr/bin')
        )
      ).rejects.toThrow(
        `Export Swift variables on ${platform} is not supported yet`
      );
    });

    it.each(['amazonlinux', 'centos', 'ubuntu'])(
      'using type erased installer',
      async platform => {
        const release = _getReleaseFile(platform);
        const toolPath = path.join(cacheDir, 'swift/5.7.3/x64/usr/bin');
        await installer.exportVariables(
          `swift-5.7.3-RELEASE`,
          release,
          toolPath
        );
        _assertExportVariables(toolPath, '5.7.3');
      }
    );

    it.each([
      ['amazonlinux', amazonlinux],
      ['centos', centos],
      ['ubuntu', ubuntu],
      ['linux', linux]
    ])('using %s installer', async (platform, installer) => {
      const toolPath = path.join(cacheDir, 'swift/5.7.3/x64/usr/bin');
      await installer.exportVariables(`swift-5.7.3-RELEASE`, toolPath);
      _assertExportVariables(toolPath, '5.7.3');
    });
  });

  describe('export Swift variables using darwin installer', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'symlinkSync').mockImplementation(() => {});
      jest.spyOn(io, 'mkdirP').mockResolvedValue(void 0);
      jest.spyOn(io, 'rmRF').mockResolvedValue(void 0);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(contents);
    });

    function _assertExportVariablesOnDarwin(toolPath: string, version: string) {
      expect(coreDebugSpy).toHaveBeenCalledWith(
        `export TOOLCHAINS environment variable: ${TOOLCHAINS}`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::debug::export TOOLCHAINS environment variable: ${TOOLCHAINS}${os.EOL}`
      );
      // expect(stdoutSpy).toHaveBeenCalledWith(
      //   `::set-env name=TOOLCHAINS::${TOOLCHAINS}${os.EOL}`
      // );
      // expect(stdoutSpy).toHaveBeenCalledWith(
      //   `::set-output name=TOOLCHAINS::${TOOLCHAINS}${os.EOL}`
      // );
      _assertExportVariables(toolPath, version);
    }

    describe('that swift is installed outside of the tool-cache', () => {
      it.each([
        [
          systemLibrary,
          path.join(systemLibrary, '/swift-5.7.3-RELEASE.xctoolchain/usr/bin')
        ],
        [
          userLibrary,
          path.join(userLibrary, '/swift-5.7.3-RELEASE.xctoolchain/usr/bin')
        ],
        [
          'Xcode default toolchains',
          path.join(xcodeLibrary, '/Defaualt.xctoolchain/usr/bin')
        ]
      ])('e.g. %s', async (scope, toolPath) => {
        await darwin.exportVariables(`swift-5.7.3-RELEASE`, toolPath);

        _assertExportVariablesOnDarwin(toolPath, '5.7.3');
      });
    });
  });
});
