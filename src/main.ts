import { EOL } from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as manifest from "./manifest";
import * as installer from "./installer";
import { System, OS, getSystem } from "./os";

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

    let versions = manifest.VERSIONS_LIST.filter(([_, os]) =>
      os.includes(system.os)
    ).map(([version, _]) => version);

    const versionSpec = tc.evaluateVersions(versions, inputVersion);

    await installer.install(versionSpec, system);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
