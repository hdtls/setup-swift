import * as core from "@actions/core";
import * as os from "os";
import * as path from "path";
import * as tc from "@actions/tool-cache";
import * as gpg from "./gpg";
import * as utils from "./utils";

const SWIFT_TOOLNAME = "swift";

export async function install(
  versionSpec: string,
  manifest: tc.IToolReleaseFile
) {
  if (tc.find(SWIFT_TOOLNAME, versionSpec)) {
    await exportVariables(versionSpec, manifest);
    return;
  }

  core.info(`Version ${versionSpec} was not found in the local cache`);

  try {
    let archivePath = await tc.downloadTool(manifest.download_url);

    let extractPath: string = "";

    switch (manifest.platform) {
      case "xcode":
        archivePath = await tc.extractXar(archivePath);
        const dest = path.join(archivePath, path.parse(manifest.filename).name);
        archivePath = path.join(
          archivePath,
          manifest.filename.replace(".pkg", "-package.pkg"),
          "Payload"
        );

        extractPath = await tc.extractTar(archivePath, dest);
        break;
      case "ubuntu":
        await gpg.importKeys();

        // core.info(`Downloading signature form ${manifest.download_url}.sig`);
        const signatureUrl = manifest.download_url + ".sig";
        const signature = await tc.downloadTool(signatureUrl);
        await gpg.verify(signature, archivePath);

        extractPath = await tc.extractTar(archivePath);
        break;
      case "windows":
        break;
      default:
        break;
    }

    await tc.cacheDir(extractPath, SWIFT_TOOLNAME, versionSpec);
  } catch (err) {
    if (err instanceof tc.HTTPError) {
      core.info(err.message);
      if (err.stack) {
        core.debug(err.stack);
      }
    }
    throw err;
  }

  await exportVariables(versionSpec, manifest);
}

async function exportVariables(
  versionSpec: string,
  manifest: tc.IToolReleaseFile
) {
  const installDir = tc.find(SWIFT_TOOLNAME, versionSpec);

  if (!installDir) {
    throw new Error(
      [
        `Version ${versionSpec} with platform ${manifest.platform}${
          manifest.platform_version || ""
        } not found`,
        `The list of all available versions can be found here: https://www.swift.org/download`,
      ].join(os.EOL)
    );
  }

  let SWIFT_VERSION = "";
  switch (manifest.platform) {
    case "xcode":
      const plist = path.join(installDir, "Info.plist");
      core.debug(`Extracting TOOLCHAINS from ${plist}...`);
      const TOOLCHAINS = await utils.extractToolChainsFromPropertyList(plist);
      core.exportVariable("TOOLCHAINS", TOOLCHAINS);

      SWIFT_VERSION = await utils.extractCommandLineMessage("xcrun", [
        "--toolchain",
        TOOLCHAINS,
        "--run",
        "swift",
        "--version",
      ]);
      SWIFT_VERSION = utils.extractSwiftVersionFromMessage(SWIFT_VERSION);
      break;
    case "ubuntu":
      const SWIFT_PLATFORM = `${manifest.platform}${
        manifest.platform_version || ""
      }`;
      SWIFT_VERSION = `swift-${versionSpec}-RELEASE-${SWIFT_PLATFORM}`;

      const binDir = path.join(installDir, SWIFT_VERSION, "/usr/bin");

      core.addPath(path.join(installDir, SWIFT_VERSION));
      core.addPath(binDir);

      const SWIFT_PATH = path.join(binDir, "swift");
      SWIFT_VERSION = await utils.extractCommandLineMessage(SWIFT_PATH, [
        "--version",
      ]);
      break;
    default:
      break;
  }

  core.setOutput("swift-version", SWIFT_VERSION);
  core.info(`Successfully set up Swift (${SWIFT_VERSION})`);
}
