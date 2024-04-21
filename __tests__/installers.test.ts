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
import * as toolchains from '../src/toolchains';
import * as gpg from '../src/gpg';

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

  beforeEach(async () => {
    console.log('::stop-commands::stoptoken'); // Disable executing of runner commands when running tests in actions
    process.env['GITHUB_ENV'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    process.env['GITHUB_PATH'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    process.env['GITHUB_OUTPUT'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out

    await io.rmRF(tempDir);
    await io.mkdirP(tempDir);
    await io.rmRF(cacheDir);
    await io.mkdirP(cacheDir);
    process.env['RUNNER_TEMP'] = tempDir;
    process.env['RUNNER_TOOL_CACHE'] = cacheDir;

    stdoutSpy = jest.spyOn(process.stdout, 'write');
    coreInfoSpy = jest.spyOn(core, 'info');
    coreDebugSpy = jest.spyOn(core, 'debug');
    execSpy = jest.spyOn(exec, 'exec');
    execSpy.mockImplementation(() => {});
    getExecOutput = jest.spyOn(exec, 'getExecOutput');
    getExecOutput.mockResolvedValue({
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
    tcExtractTarSpy = jest.spyOn(tc, 'extractTar');
    tcExtractXarSpy = jest.spyOn(tc, 'extractXar');
    tcCacheDirSpy = jest.spyOn(tc, 'cacheDir');
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    console.log('::stoptoken::'); // Re-enable executing of runner commands when running tests in actions
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

  function _assertExportVariables(toolPath: string, version?: string) {
    expect(stdoutSpy).toHaveBeenCalledWith(`::add-path::${toolPath}${os.EOL}`);
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-path::${path.join(toolPath, 'swift')}${os.EOL}`
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-version::${version || '5.7.3'}${os.EOL}`
    );
    expect(coreInfoSpy).toHaveBeenCalledWith(
      `Successfully set up Swift ${version || '5.7.3'} (swift-${
        version || '5.7.3'
      }-RELEASE)`
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

    it.each(['amazonlinux', 'centos', 'darwin', 'ubuntu'])(
      'using type erased installer',
      async platform => {
        const release = _getReleaseFile(platform);
        tcExtractTarSpy.mockImplementation(async () => {
          const extractPath = path.join(tempDir, 'swift');
          await io.mkdirP(extractPath);
          return extractPath;
        });
        if (platform == 'darwin') {
          tcExtractXarSpy.mockResolvedValue('');
        }

        await installer.install('swift-5.7.3-RELEASE', release);
        expect(
          fs.existsSync(path.join(cacheDir, 'swift/5.7.3/x64'))
        ).toBeTruthy();
      }
    );

    it.each([
      ['amazonlinux', amazonlinux],
      ['centos', centos],
      ['ubuntu', ubuntu],
      ['linux', linux]
    ])('using %s installer', async (platform, installer) => {
      const release = _getReleaseFile(platform);
      tcExtractTarSpy.mockImplementation(async () => {
        const extractPath = path.join(tempDir, 'swift');
        await io.mkdirP(extractPath);
        return extractPath;
      });

      await installer.install('swift-5.7.3-RELEASE', release);

      expect(downloadToolSpy).toHaveBeenCalledTimes(2);
      expect(gpgImportKeysSpy).toHaveBeenCalled();
      expect(gpgVerifySpy).toHaveBeenCalled();
      expect(tcExtractTarSpy).toHaveBeenCalled();
      expect(tcCacheDirSpy).toHaveBeenCalled();
      if (platform == 'linux') {
        expect(execSpy).toHaveBeenCalledTimes(0);
      } else {
        expect(execSpy).toHaveBeenCalled();
      }
      expect(
        fs.existsSync(path.join(cacheDir, 'swift/5.7.3/x64'))
      ).toBeTruthy();
    });

    it('using darwin installer', async () => {
      tcExtractXarSpy.mockResolvedValue('');
      tcExtractTarSpy.mockImplementation(async () => {
        const extractPath = path.join(tempDir, 'swift');
        await io.mkdirP(extractPath);
        return extractPath;
      });
      const release = _getReleaseFile('darwin');
      await installer.install('swift-5.7.3-RELEASE', release);
      expect(
        fs.existsSync(path.join(cacheDir, 'swift/5.7.3/x64'))
      ).toBeTruthy();
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

    it('using type erased installer', async () => {
      const release = _getReleaseFile('ubuntu');
      const toolPath = path.join(cacheDir, 'swift/5.7.3/x64/usr/bin');
      await installer.exportVariables(`swift-5.7.3-RELEASE`, release, toolPath);
      _assertExportVariables(toolPath);
    });

    it.each([
      ['amazonlinux', amazonlinux],
      ['centos', centos],
      ['ubuntu', ubuntu],
      ['linux', linux]
    ])('using %s installer', async (platform, installer) => {
      const toolPath = path.join(cacheDir, 'swift/5.7.3/x64/usr/bin');

      await installer.exportVariables(`swift-5.7.3-RELEASE`, toolPath);

      _assertExportVariables(toolPath);
    });
  });

  describe('export Swift variables using darwin installer', () => {
    let existsSpy: jest.SpyInstance;
    let readFileSpy: jest.SpyInstance;
    let symlinkSpy: jest.SpyInstance;
    let mkdirPSpy: jest.SpyInstance;
    let rmRFSpy: jest.SpyInstance;

    // beforeEach(() => {
    //   existsSpy = jest.spyOn(fs, 'existsSync');
    //   existsSpy.mockReturnValue(true);
    //   readFileSpy = jest.spyOn(fs, 'readFileSync');
    //   readFileSpy.mockReturnValue(contents);
    //   symlinkSpy = jest.spyOn(fs, 'symlinkSync');
    //   symlinkSpy.mockImplementation(() => {});
    //   mkdirPSpy = jest.spyOn(io, 'mkdirP');
    //   mkdirPSpy.mockImplementation(
    //     () =>
    //       new Promise<void>((resolve, reject) => {
    //         resolve(void 0);
    //       })
    //   );
    //   rmRFSpy = jest.spyOn(io, 'rmRF');
    //   rmRFSpy.mockImplementation(
    //     () =>
    //       new Promise<void>((resolve, reject) => {
    //         resolve(void 0);
    //       })
    //   );
    //   jest
    //     .spyOn(toolchains, 'getToolchainsDirectory')
    //     .mockReturnValue(path.join(__dirname, 'TEMP'));
    // });

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

    // describe('unmaintained', () => {
    //   it.each([
    //     [
    //       '/Library/Developer/Toolchains',
    //       path.join(
    //         toolchains.getSystemToolchainsDirectory(),
    //         '/swift-5.7.3-RELEASE/usr/bin'
    //       )
    //     ],
    //     [
    //       'Users/runner/Library/Developer/Toolchains',
    //       path.join(
    //         __dirname,
    //         'TEMP',
    //         '/swift-5.7.1-RELEASE.xctoolchain/usr/bin'
    //       )
    //     ],
    //     [
    //       'Xcode default toolchains',
    //       path.join(
    //         toolchains.getXcodeDefaultToolchainsDirectory(),
    //         '/swift-5.7.3-RELEASE/usr/bin'
    //       )
    //     ]
    //   ])('toolchain is in the %s', async (scope, toolchain) => {
    //     const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //     const expectedToolPath = path.join(toolPath, '/usr/bin');
    //     const release = _getReleaseFile('darwin');

    //     await installer.exportVariables(
    //       `swift-5.7.3-RELEASE`,
    //       release,
    //       toolchain
    //     );

    //     expect(existsSpy).toHaveBeenCalledTimes(1);
    //     expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    //     expect(rmRFSpy).toHaveBeenCalledTimes(0);
    //     expect(symlinkSpy).toHaveBeenCalledTimes(0);
    //     _assertExportVariablesOnDarwin(expectedToolPath);
    //   });
    // });

    // describe('maintained (tool cache)', () => {
    //   describe('user toolchains does not exists', () => {
    //     it('should create user toolchains directory', async () => {
    //       const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
    //       const release = _getReleaseFile('darwin');
    //       const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //       const expectedToolPath = path.join(toolPath, '/usr/bin');

    //       // user toolchains dir not exists so subdir is the same.
    //       existsSpy
    //         .mockReturnValueOnce(false)
    //         .mockReturnValueOnce(false)
    //         .mockReturnValueOnce(false);

    //       await installer.exportVariables(
    //         `swift-5.7.3-RELEASE`,
    //         release,
    //         toolchain
    //       );

    //       expect(existsSpy).toHaveBeenCalledTimes(4);
    //       expect(mkdirPSpy).toHaveBeenCalledTimes(1);
    //       expect(rmRFSpy).toHaveBeenCalledTimes(0);
    //       expect(symlinkSpy).toHaveBeenCalledTimes(1);
    //       _assertExportVariablesOnDarwin(expectedToolPath);
    //     });
    //   });

    //   describe('user toolchains exists', () => {
    //     it('toolchain with same version exists swift-latest symblink does not exists', async () => {
    //       const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
    //       const release = _getReleaseFile('darwin');
    //       const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //       const expectedToolPath = path.join(toolPath, '/usr/bin');

    //       existsSpy
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(false);

    //       await installer.exportVariables(
    //         `swift-5.7.3-RELEASE`,
    //         release,
    //         toolchain
    //       );

    //       expect(existsSpy).toHaveBeenCalledTimes(4);
    //       expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    //       expect(rmRFSpy).toHaveBeenCalledTimes(1);
    //       expect(symlinkSpy).toHaveBeenCalledTimes(1);
    //       _assertExportVariablesOnDarwin(expectedToolPath);
    //     });

    //     it('toolchain with same version exists swift-latest symblink also exists', async () => {
    //       const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
    //       const release = _getReleaseFile('darwin');
    //       const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //       const expectedToolPath = path.join(toolPath, '/usr/bin');

    //       existsSpy
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(true);

    //       await installer.exportVariables(
    //         `swift-5.7.3-RELEASE`,
    //         release,
    //         toolchain
    //       );

    //       expect(existsSpy).toHaveBeenCalledTimes(4);
    //       expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    //       expect(rmRFSpy).toHaveBeenCalledTimes(2);
    //       expect(symlinkSpy).toHaveBeenCalledTimes(1);
    //       _assertExportVariablesOnDarwin(expectedToolPath);
    //     });

    //     it('toolchain with same version does not exists but swift-latest symblink exists', async () => {
    //       const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
    //       const release = _getReleaseFile('darwin');
    //       const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //       const expectedToolPath = path.join(toolPath, '/usr/bin');

    //       existsSpy
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(false)
    //         .mockReturnValueOnce(true);

    //       await installer.exportVariables(
    //         `swift-5.7.3-RELEASE`,
    //         release,
    //         toolchain
    //       );

    //       expect(existsSpy).toHaveBeenCalledTimes(4);
    //       expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    //       expect(rmRFSpy).toHaveBeenCalledTimes(1);
    //       expect(symlinkSpy).toHaveBeenCalledTimes(1);
    //       _assertExportVariablesOnDarwin(expectedToolPath);
    //     });

    //     it('both toolchain with same version and swift-latest symblink does not exists', async () => {
    //       const toolchain = '/opt/hostedtoolcache/swift/5.7.3/x64/usr/bin';
    //       const release = _getReleaseFile('darwin');
    //       const toolPath = toolchain.split('/').slice(0, -2).join('/');
    //       const expectedToolPath = path.join(toolPath, '/usr/bin');

    //       existsSpy
    //         .mockReturnValueOnce(true)
    //         .mockReturnValueOnce(false)
    //         .mockReturnValueOnce(false);

    //       await installer.exportVariables(
    //         `swift-5.7.3-RELEASE`,
    //         release,
    //         toolchain
    //       );

    //       expect(existsSpy).toHaveBeenCalledTimes(4);
    //       expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    //       expect(rmRFSpy).toHaveBeenCalledTimes(0);
    //       expect(symlinkSpy).toHaveBeenCalledTimes(1);
    //       _assertExportVariablesOnDarwin(expectedToolPath);
    //     });
    //   });
    // });
  });
});
