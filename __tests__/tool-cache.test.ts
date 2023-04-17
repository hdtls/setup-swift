import * as fs from 'fs';
import * as path from 'path';
import * as io from '@actions/io';

const cachePath = path.join(__dirname, 'CACHE');
const tempPath = path.join(__dirname, 'TEMP');
// Set temp and tool directories before importing (used to set global state)
process.env['RUNNER_TEMP'] = tempPath;
process.env['RUNNER_TOOL_CACHE'] = cachePath;

// eslint-disable-next-line import/first
import * as tc from '../src/tool-cache';

describe('tool-cache', function () {
  beforeEach(async function () {
    await io.rmRF(cachePath);
    await io.rmRF(tempPath);
    await io.mkdirP(cachePath);
    await io.mkdirP(tempPath);
  });

  afterAll(async function () {
    await io.rmRF(tempPath);
    await io.rmRF(cachePath);
  });

  it.each([
    ['swift-5.7-RELEASE', '5.7.0'],
    ['swift-5.7.1-RELEASE', '5.7.1'],
    ['swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a', 'main+20230411'],
    ['swift-5.9-DEVELOPMENT-SNAPSHOT-2023-04-12-a', '5.9+20230412']
  ])(
    'resolve version for cache tool with version %s',
    (versionSpec, expected) => {
      expect(tc._getCacheVersion(versionSpec)).toBe(expected);
    }
  );

  it.each([
    'swift-5.7-RELEASE',
    'swift-5.7.1-RELEASE',
    'swift-DEVELOPMENT-SNAPSHOT-2023-04-11-a',
    'swift-5.9-DEVELOPMENT-SNAPSHOT-2023-04-12-a'
  ])('cache tool with version %s and finds it', async versionSpec => {
    const tempDir = path.join(__dirname, versionSpec);
    try {
      await io.mkdirP(tempDir);

      fs.writeFileSync(path.join(tempDir, 'file.txt'), 'overwriteMe');

      await tc.cacheDir(tempDir, 'swift', versionSpec);
      const toolPath: string = tc.find('swift', versionSpec);

      expect(fs.existsSync(toolPath)).toBeTruthy();
      expect(fs.existsSync(`${toolPath}.complete`)).toBeTruthy();
      expect(fs.existsSync(path.join(toolPath, 'file.txt'))).toBeTruthy();
      expect(fs.readFileSync(path.join(toolPath, 'file.txt'), 'utf8')).toBe(
        'overwriteMe'
      );
    } finally {
      await io.rmRF(tempDir);
    }
  });
});
