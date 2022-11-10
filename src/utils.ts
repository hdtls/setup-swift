import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as assert from "assert";
import * as pl from "plist";
import * as fs from "fs";

export function parseVersionFromCommandLineMessage(message: string): string {
  const match = message.match(
    /Swift\ version (?<version>[0-9]+\.[0-9+]+(\.[0-9]+)?)/
  ) || {
    groups: { version: null },
  };

  if (!match.groups || !match.groups.version) {
    return "";
  }

  return match.groups.version || "";
}

export async function parseBundleIDFromPropertyList(
  plist: string
): Promise<string> {
  try {
    let message = pl.parse(fs.readFileSync(plist, "utf8")) as {
      CFBundleIdentifier: string;
    };
    return message.CFBundleIdentifier;
  } catch (error) {
    return "";
  }
}

export async function commandLineMessage(
  commandLine: string,
  args?: string[]
): Promise<string> {
  let message = "";
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        message += data.toString().trim();
      },
      stderr: (data: Buffer) => {
        core.error(data.toString().trim());
      },
    },
  };

  await exec.exec(commandLine, args, options);

  return message;
}

function _getTempDirectory() {
  const tempDirectory = process.env["RUNNER_TEMP"] || "";
  assert.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
  return tempDirectory;
}
