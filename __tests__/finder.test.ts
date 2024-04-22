import * as exec from '@actions/exec';
import * as io from '@actions/io';
import fs from 'fs';
import * as path from 'path';
import * as finder from '../src/finder';
import * as tc from '@actions/tool-cache';
import * as toolchains from '../src/toolchains';

const tempDir = path.join(__dirname, 'TEMP');
const cacheDir = path.join(__dirname, 'TOOL_CACHE');
const systemLibrary = path.join(__dirname, 'TEMP', 'System');
const userLibrary = path.join(__dirname, 'TEMP', 'User');
const xcodeLibrary = path.join(__dirname, 'TEMP', 'Xcode');

describe('finder', () => {
  let findInPathSpy: jest.SpyInstance;
  let getExecOutputSpy: jest.SpyInstance;
  let tcFindSpy: jest.SpyInstance;

  beforeEach(async () => {
    console.log('::stop-commands::stoptoken'); // Disable executing of runner commands when running tests in actions

    await io.mkdirP(tempDir);
    await io.mkdirP(cacheDir);
    await io.mkdirP(systemLibrary);
    await io.mkdirP(userLibrary);
    await io.mkdirP(xcodeLibrary);

    process.env['RUNNER_TEMP'] = tempDir;
    process.env['RUNNER_TOOL_CACHE'] = cacheDir;

    jest
      .spyOn(toolchains, 'getSystemToolchainsDirectory')
      .mockReturnValue(systemLibrary);
    jest
      .spyOn(toolchains, 'getToolchainsDirectory')
      .mockReturnValue(userLibrary);
    jest
      .spyOn(toolchains, 'getXcodeDefaultToolchainsDirectory')
      .mockReturnValue(xcodeLibrary);

    findInPathSpy = jest.spyOn(io, 'findInPath');
    getExecOutputSpy = jest.spyOn(exec, 'getExecOutput').mockResolvedValue({
      stdout: `Swift version 5.8 (swift-5.8-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
      exitCode: 0,
      stderr: ''
    });
    tcFindSpy = jest.spyOn(tc, 'find');
  });

  afterEach(async () => {
    console.log('::stoptoken::'); // Re-enable executing of runner commands when running tests in actions

    await io.rmRF(systemLibrary);
    await io.rmRF(userLibrary);
    await io.rmRF(xcodeLibrary);
    await io.rmRF(cacheDir);
    await io.rmRF(tempDir);

    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('find specified version of Swift in tool-cache', async () => {
    let expected = '/opt/hostedtoolcache/swift/5.8.0/x64/usr/bin';
    tcFindSpy.mockReturnValue('/opt/hostedtoolcache/swift/5.8.0/x64');

    let actual = await finder.find('swift-5.8-RELEASE', 'darwin', 'x64');

    expect(actual).toBe(expected);
    expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    expect(findInPathSpy).toHaveBeenCalledTimes(0);

    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    expected = path.join(cacheDir, 'swift/6.0+20240420/x64/usr/bin');
    actual = await finder.find(
      'swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-20-a',
      'darwin',
      'x64'
    );
    expect(actual).toBe(expected);
    expect(tcFindSpy).toHaveBeenCalledTimes(1);
    expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    expect(findInPathSpy).toHaveBeenCalledTimes(0);

    actual = await finder.find(
      'swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-20-a',
      'darwin',
      'x64'
    );
    expect(actual).toBe('');
    expect(tcFindSpy).toHaveBeenCalledTimes(1);
    expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    expect(findInPathSpy).toHaveBeenCalledTimes(0);
  });

  it.each(['amazonlinux', 'centos', 'ubuntu'])(
    'find specified version of Swift outside of tool-cache on [%s]',
    async platform => {
      tcFindSpy.mockReturnValue('');
      findInPathSpy
        // Contains matched version of Swift.
        .mockResolvedValueOnce(['/usr/bin/swift', '/usr/local/bin/swift'])
        .mockResolvedValueOnce(['/usr/bin/swift'])
        // Does not contains matched version of Swift.
        .mockResolvedValueOnce(['/usr/bin/swift'])
        // Does installed any version of Swift.
        .mockResolvedValueOnce([]);

      let toolPath = await finder.find('swift-5.8-RELEASE', platform, 'x64');
      expect(toolPath).toBe('/usr/bin');
      expect(findInPathSpy).toHaveBeenCalledTimes(1);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(1);

      toolPath = await finder.find('swift-5.8-RELEASE', platform, 'x64');
      expect(toolPath).toBe('/usr/bin');
      expect(findInPathSpy).toHaveBeenCalledTimes(2);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(2);

      getExecOutputSpy.mockResolvedValue({
        stdout: `Swift version 5.8.1 (swift-5.8.1-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
        exitCode: 0,
        stderr: ''
      });
      toolPath = await finder.find('swift-5.8-RELEASE', platform, 'x64');
      expect(toolPath).toBe('');
      expect(findInPathSpy).toHaveBeenCalledTimes(3);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(3);

      toolPath = await finder.find('swift-5.8-RELEASE', platform, 'x64');
      expect(toolPath).toBe('');
      expect(findInPathSpy).toHaveBeenCalledTimes(4);
      expect(getExecOutputSpy).toHaveBeenCalledTimes(3);
    }
  );

  it('find specified version of Swift outside of tool-cache on darwin', async () => {
    tcFindSpy.mockReturnValue('');
    let expected = path.join(
      userLibrary,
      'swift-5.8-RELEASE.xctoolchain/usr/bin'
    );
    await io.mkdirP(expected);
    fs.writeFileSync(path.join(expected, 'swift'), '');
    let toolPath = await finder.find('swift-5.8-RELEASE', 'darwin', 'x64');
    expect(getExecOutputSpy).toHaveBeenCalledTimes(0);
    expect(toolPath).toBe(expected);
    await io.rmRF(userLibrary);

    // swift-latest.xctoolchain match specified version of swift.
    expected = path.join(userLibrary, 'swift-latest.xctoolchain/usr/bin');
    await io.mkdirP(expected);
    fs.writeFileSync(path.join(expected, 'swift'), '');
    toolPath = await finder.find('swift-5.8-RELEASE', 'darwin', 'x64');
    expect(getExecOutputSpy).toHaveBeenCalledTimes(1);
    expect(toolPath).toBe(expected);
    await io.rmRF(userLibrary);

    // swift-latest.xctoolchain desn not match specified version of swift.
    expected = path.join(userLibrary, 'swift-latest.xctoolchain/usr/bin');
    await io.mkdirP(expected);
    fs.writeFileSync(path.join(expected, 'swift'), '');
    getExecOutputSpy.mockResolvedValue({
      stdout: `Swift version 5.8.1 (swift-5.8.1-RELEASE)
        Target: x86_64-unknown-linux-gnu`,
      exitCode: 0,
      stderr: ''
    });
    toolPath = await finder.find('swift-5.8-RELEASE', 'darwin', 'x64');
    expect(getExecOutputSpy).toHaveBeenCalledTimes(2);
    expect(toolPath).toBe('');
    await io.rmRF(userLibrary);

    // Desn not installed any version of swift
    await io.mkdirP(userLibrary);
    toolPath = await finder.find('swift-5.8-RELEASE', 'darwin', 'x64');
    expect(getExecOutputSpy).toHaveBeenCalledTimes(2);
    expect(toolPath).toBe('');
    await io.rmRF(userLibrary);
  });
});
