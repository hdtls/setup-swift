import * as assert from "assert";
import * as pl from "plist";
import * as fs from "fs";
import path from "path";
import * as os from "os";

export function parseVersionFromLog(message: string): string {
  const match = message.match(
    /Swift\ version (?<version>[0-9]+\.[0-9+]+(\.[0-9]+)?)/
  );
  return match?.groups?.version || "";
}

export function parseBundleIDFromPropertyList(plist: string): string {
  try {
    const { CFBundleIdentifier } = pl.parse(fs.readFileSync(plist, "utf8")) as {
      CFBundleIdentifier?: string;
    };
    return CFBundleIdentifier || "";
  } catch (error) {
    return "";
  }
}

export function getTempDirectory() {
  const tempDirectory = process.env["RUNNER_TEMP"] || "";
  assert.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
  return tempDirectory;
}

export function getToolchainsDirectory() {
  return path.join(os.homedir(), "/Library/Developer/Toolchains");
}

export const SWIFT_LATEST_XCTOOLCHAIN = path.join(
  getToolchainsDirectory(),
  "swift-latest.xctoolchain"
);
