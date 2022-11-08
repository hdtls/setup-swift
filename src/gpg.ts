import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { ExecOptions } from "@actions/exec/lib/interfaces";

export async function importKeys() {
  await setupKeys();
}

export async function setupKeys() {
  let keys = await tc.downloadTool("https://swift.org/keys/all-keys.asc");

  let output = "";

  const options: ExecOptions = {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
  };

  await exec.exec(
    "gpg",
    ["--batch", "--import-options", "import-show", "--import", keys],
    options
  );

  await exec.exec("gpg", [
    "--batch",
    "--quiet",
    "--keyserver",
    "keyserver.ubuntu.com",
    "--recv-keys",
    keys,
  ]);
}

export async function verify(signature: string, archive: string) {
  await exec.exec("gpg", ["--batch", "--verify", signature, archive]);
}
