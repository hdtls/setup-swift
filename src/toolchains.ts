import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { re, t } from './re';

/**
 * Gets bundle identifier from Info.plist or ToolchainInfo.plist
 *
 * @param at directory of the info plist
 * @returns  bundle identifier if success or empty
 */
export function parseBundleIDFromDirectory(at: string): string {
  let pl = path.join(at, 'Info.plist');

  if (!fs.existsSync(pl)) {
    pl = path.join(at, 'ToolchainInfo.plist');

    if (!fs.existsSync(pl)) {
      return '';
    }
  }

  return (
    fs.readFileSync(pl, 'utf8').match(re[t.TOOLCHAINS])?.groups?.TOOLCHAINS ||
    ''
  );
}

export function getSystemToolchainsDirectory(): string {
  return '/Library/Developer/Toolchains';
}

export function getToolchainsDirectory(): string {
  return path.join(os.homedir(), '/Library/Developer/Toolchains');
}

/**
 * Gets xctoolchain path with toolchain name
 *
 * @param named toolchain name
 * @returns path for toolchain
 */
export function getToolchain(
  named: string,
  directory: string = getToolchainsDirectory()
): string {
  return path.join(directory, `${named}.xctoolchain`);
}

/**
 * Gets the Xcode default toolchain directory
 */
export function getXcodeDefaultToolchainsDirectory(): string {
  return '/Applications/Xcode.app/Contents/Developer/Toolchains';
}
