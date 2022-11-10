import * as assert_1 from "assert";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export function extractSwiftVersionFromMessage(message: string): string {
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

export async function extractToolChainsFromPropertyList(plist: string) {
  await extractCommandLineMessage(
    `echo "TOOLCHAINS=$(plutil -extract 'CFBundleIdentifier' xml1 ${plist} | xmllint --xpath '//plist/string/text()' -)" >> $GITHUB_ENV`
  );

  return extractCommandLineMessage("echo $TOOLCHAINS");
}

export async function extractCommandLineMessage(
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

export function getTempDirectory() {
  const tempDirectory = process.env["RUNNER_TEMP"] || "";
  assert_1.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
  return tempDirectory;
}
