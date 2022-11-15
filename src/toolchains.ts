import fs from 'fs';
import os from 'os';
import path from 'path';
import * as pl from 'plist';

export function parseBundleIDFromDirectory(at: string): string {
  try {
    const { CFBundleIdentifier, Identifier } = pl.parse(
      fs.readFileSync(path.join(at, 'Info.plist'), 'utf8')
    ) as {
      CFBundleIdentifier?: string;
      Identifier?: string;
    };

    return CFBundleIdentifier || Identifier || '';
  } catch (error) {
    return '';
  }
}

export function getToolchainsDirectory(): string {
  return path.join(os.homedir(), '/Library/Developer/Toolchains');
}

export function getToolchain(named: string): string {
  return path.join(getToolchainsDirectory(), `${named}.xctoolchain`);
}

export function getXcodeDefaultToolchain(): string {
  return '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain';
}
