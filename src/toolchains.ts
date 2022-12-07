import fs from 'fs';
import os from 'os';
import path from 'path';
import * as re from './re';

export function parseBundleIDFromDirectory(at: string): string {
  let pl = path.join(at, 'Info.plist');

  if (!fs.existsSync(pl)) {
    pl = path.join(at, 'ToolchainInfo.plist');

    if (!fs.existsSync(pl)) {
      return '';
    }
  }

  return (
    fs.readFileSync(pl, 'utf8').match(re.TOOLCHAINS)?.groups?.TOOLCHAINS || ''
  );
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
