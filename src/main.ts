import * as core from "@actions/core";
import * as manifest from "./manifest";
import * as installer from "./installer";
import { getSystem } from "./system";

function getVersion(): string {
  let versionSpec = core.getInput("swift-version");
  return versionSpec;
}

export async function run() {
  try {
    let system = await getSystem();
    let inputVersion = getVersion();

    if (inputVersion.length === 0) {
      core.warning(
        "The `swift-version` input is not set. The latest version of Swift will be used."
      );
    }

    const versionSpec = manifest.evaluateVersion(inputVersion, system);

    const release = manifest.resolveReleaseFile(versionSpec, system);

    await installer.install(versionSpec, release);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
