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
  const commandLine = `plutil -extract 'CFBundleIdentifier' xml1 ${plist} | xmllint --xpath '//plist/string/text()' -`;
  return await extractCommandLineMessage(commandLine);
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
