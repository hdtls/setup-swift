import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';
import fs from 'fs';
import os from 'os';
import * as installer from '../src/installer';

const TOOLCHAINS = 'org.swift.580202303301a';
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
	<date>2023-03-30T22:07:27Z</date>
	<key>DisplayName</key>
	<string>Swift 5.8 Release 2023-03-30 (a)</string>
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
	<string>Swift 5.8 Release</string>
	<key>Version</key>
	<string>5.8.20230330101</string>
</dict>
</plist>
`;

describe('installer', () => {
  let stdoutSpy: jest.SpyInstance;
  let coreInfoSpy: jest.SpyInstance;
  let coreDebugSpy: jest.SpyInstance;
  let homedirSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env['GITHUB_PATH'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    process.env['GITHUB_OUTPUT'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out

    homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(__dirname);

    stdoutSpy = jest.spyOn(process.stdout, 'write');
    coreInfoSpy = jest.spyOn(core, 'info');
    coreDebugSpy = jest.spyOn(core, 'debug');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('install on unsupported platform', async () => {
    const manifest = {
      version: 'swift-5.8-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'android',
          download_url: '',
          arch: 'arm64',
          platform_version: undefined
        }
      ]
    };

    await expect(installer.install(manifest)).rejects.toThrow(
      `Installing Swift on android is not supported yet`
    );
  });

  it.each(['ubuntu', 'centos', 'amazonlinux'])(
    'export variables for %s',
    async platform => {
      const stdout = `Swift version 5.8 (swift-5.8-RELEASE)
    Target: x86_64-unknown-linux-gnu`;
      jest
        .spyOn(exec, 'getExecOutput')
        .mockResolvedValue({ stdout, exitCode: 0, stderr: '' });

      const manifest = {
        version: 'swift-5.8-RELEASE',
        stable: true,
        release_url: '',
        files: [
          {
            filename: '',
            platform: platform,
            download_url: '',
            arch: 'arm64',
            platform_version: undefined
          }
        ]
      };

      await installer.exportVariables(manifest, __dirname);

      expect(stdoutSpy).toHaveBeenCalledWith(
        `::add-path::${__dirname}${os.EOL}`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::set-output name=swift-path::${path.join(__dirname, 'swift')}${
          os.EOL
        }`
      );
      expect(stdoutSpy).toHaveBeenCalledWith(
        `::set-output name=swift-version::5.8${os.EOL}`
      );
      expect(coreInfoSpy).toBeCalledWith(
        `Successfully set up Swift 5.8 (swift-5.8-RELEASE)`
      );
    }
  );

  it.each([
    '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin',
    '/Library/Developer/Toolchains/swift-5.8-RELEASE.xctoolchain/usr/bin',
    `${__dirname}/Library/Developer/Toolchains/swift-5.8-RELEASE.xctoolchain/usr/bin`
  ])('export variables for darwin %s', async toolchain => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'symlinkSync').mockImplementation(() => {});
    jest.spyOn(fs, 'readFileSync').mockReturnValue(contents);
    const stdout = `Apple Swift version 5.8 (swift-5.8-RELEASE)
  Target: x86_64-apple-macosx12.0`;
    jest
      .spyOn(exec, 'getExecOutput')
      .mockResolvedValue({ stdout, exitCode: 0, stderr: '' });

    let toolPath = toolchain.split('/').slice(0, -2).join('/');

    const manifest = {
      version: 'swift-5.8-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'darwin',
          download_url: '',
          arch: 'x64',
          platform_version: undefined
        }
      ]
    };
    await installer.exportVariables(manifest, toolchain);

    const expectedToolPath = path.join(toolPath, '/usr/bin');

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
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::add-path::${expectedToolPath}${os.EOL}`
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-path::${path.join(expectedToolPath, 'swift')}${
        os.EOL
      }`
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      `::set-output name=swift-version::5.8${os.EOL}`
    );
    expect(coreInfoSpy).toBeCalledWith(
      `Successfully set up Swift 5.8 (swift-5.8-RELEASE)`
    );
  });

  it('export variables for unsupported platform', async () => {
    const manifest = {
      version: 'swift-5.7.1-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'android',
          download_url: '',
          arch: 'arm64',
          platform_version: undefined
        }
      ]
    };

    await expect(
      installer.exportVariables(manifest, __dirname)
    ).rejects.toThrow(
      `Installing Swift on ${manifest.files[0].platform} is not supported yet`
    );
  });

  it('export variables should make toolchains directory if not exists', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(contents);
    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    const fssymlinkSpy = jest.spyOn(fs, 'symlinkSync');
    fssymlinkSpy.mockImplementation(() => {});
    const iormRFSpy = jest.spyOn(io, 'rmRF');
    iormRFSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );
    const iomkdirPSpy = jest.spyOn(io, 'mkdirP');
    iomkdirPSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );

    const stdout = `Apple Swift version 5.8 (swift-5.8-RELEASE)
Target: x86_64-apple-macosx12.0`;
    jest
      .spyOn(exec, 'getExecOutput')
      .mockResolvedValue({ stdout, exitCode: 0, stderr: '' });

    const manifest = {
      version: 'swift-5.8-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'darwin',
          download_url: '',
          arch: 'x64',
          platform_version: undefined
        }
      ]
    };

    await installer.exportVariables(manifest, __dirname);

    expect(fssymlinkSpy).toBeCalledTimes(1);
    expect(iomkdirPSpy).toBeCalledTimes(1);
    expect(iormRFSpy).toBeCalledTimes(0);
  });

  it('export variables should rmeove exists toolchains', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(contents);
    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const fssymlinkSpy = jest.spyOn(fs, 'symlinkSync');
    fssymlinkSpy.mockImplementation(() => {});
    const iormRFSpy = jest.spyOn(io, 'rmRF');
    iormRFSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );
    const iomkdirPSpy = jest.spyOn(io, 'mkdirP');
    iomkdirPSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );

    const stdout = `Apple Swift version 5.8 (swift-5.8-RELEASE)
Target: x86_64-apple-macosx12.0`;
    jest
      .spyOn(exec, 'getExecOutput')
      .mockResolvedValue({ stdout, exitCode: 0, stderr: '' });

    const manifest = {
      version: 'swift-5.8-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'darwin',
          download_url: '',
          arch: 'x64',
          platform_version: undefined
        }
      ]
    };

    await installer.exportVariables(manifest, __dirname);

    expect(fssymlinkSpy).toBeCalledTimes(1);
    expect(iomkdirPSpy).toBeCalledTimes(0);
    expect(iormRFSpy).toBeCalledTimes(1);
  });

  it('export variables should remove swift-latest.xctoolchain', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(contents);
    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const fssymlinkSpy = jest.spyOn(fs, 'symlinkSync');
    fssymlinkSpy.mockImplementation(() => {});
    const iormRFSpy = jest.spyOn(io, 'rmRF');
    iormRFSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );
    const iomkdirPSpy = jest.spyOn(io, 'mkdirP');
    iomkdirPSpy.mockImplementation(
      inputPath => new Promise<void>((resolve, reject) => resolve())
    );

    const stdout = `Apple Swift version 5.8 (swift-5.8-RELEASE)
Target: x86_64-apple-macosx12.0`;
    jest
      .spyOn(exec, 'getExecOutput')
      .mockResolvedValue({ stdout, exitCode: 0, stderr: '' });

    const manifest = {
      version: 'swift-5.8-RELEASE',
      stable: true,
      release_url: '',
      files: [
        {
          filename: '',
          platform: 'darwin',
          download_url: '',
          arch: 'x64',
          platform_version: undefined
        }
      ]
    };

    await installer.exportVariables(manifest, __dirname);

    expect(fssymlinkSpy).toBeCalledTimes(1);
    expect(iomkdirPSpy).toBeCalledTimes(0);
    expect(iormRFSpy).toBeCalledTimes(1);
  });
});
