import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { ExecOptions } from "@actions/exec/lib/interfaces";

export async function importKeys() {
  let keys = await tc.downloadTool("https://swift.org/keys/all-keys.asc");

  const options: ExecOptions = {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        core.info(data.toString().trim());
      },
      stderr: (data: Buffer) => {
        core.error(data.toString().trim());
      },
    },
  };

  await exec.exec("gpg", ["--import", keys], options);
}

export async function verify(signature: string, archive: string) {
  const options: ExecOptions = {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        core.info(data.toString().trim());
      },
      stderr: (data: Buffer) => {
        core.error(data.toString().trim());
      },
    },
  };

  await exec.exec(
    "gpg",
    ["--keyserver", "hkp://keyserver.ubuntu.com", "--refresh-keys", "Swift"],
    options
  );
  await exec.exec("gpg", ["--verify", signature, archive]);
}
