import * as core from "@actions/core";
import * as manifest from "./manifest";
import * as installer from "./installer";
import { getSystem } from "./system";

export async function run() {
  let system = await getSystem();
  let inputVersion = core.getInput("swift-version");

  if (inputVersion.length === 0) {
    core.warning(
      "The `swift-version` input is not set. The latest version of Swift will be used."
    );
  }

  const versionSpec = manifest.evaluateVersion(inputVersion, system);

  const release = manifest.resolveReleaseFile(versionSpec, system);

  await installer.install(versionSpec, release);
}
