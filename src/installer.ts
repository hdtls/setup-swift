import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as io from "@actions/io";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
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
        extractPath = await tc.extractXar(archivePath);

        archivePath = path.join(
          extractPath,
          manifest.filename.replace(".pkg", "-package.pkg"),
          "Payload"
        );

        extractPath = await tc.extractTar(archivePath);
        break;
      case "ubuntu":
        archivePath = await tc.downloadTool(manifest.download_url);

        await gpg.importKeys();

        // core.info(`Downloading signature form ${manifest.download_url}.sig`);
        const signatureUrl = manifest.download_url + ".sig";
        const signature = await tc.downloadTool(signatureUrl);
        await gpg.verify(signature, archivePath);

        extractPath = await tc.extractTar(archivePath);
        extractPath = path.join(
          extractPath,
          `swift-${versionSpec}-RELEASE-${manifest.platform}${
            manifest.platform_version || ""
          }`
        );
        break;
      case "windows":
        break;
      default:
        break;
    }

    await tc.cacheDir(extractPath, SWIFT_TOOLNAME, versionSpec);
    await exportVariables(versionSpec, manifest);
  } catch (err) {
    if (err instanceof tc.HTTPError) {
      core.info(err.message);
      if (err.stack) {
        core.debug(err.stack);
      }
    }
    throw err;
  }
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
  let SWIFT_PATH = path.join(installDir, "/usr/bin");

  core.addPath(SWIFT_PATH);

  switch (manifest.platform) {
    case "xcode":
      const tcDir = `${os.homedir()}/Library/Developer/Toolchains`;

      await io.mkdirP(tcDir);

      let toolchain = path.join(
        tcDir,
        `${manifest.filename.replace("-osx.pkg", "")}.xctoolchain`
      );

      if (fs.existsSync(toolchain)) {
        io.rmRF(toolchain);
      }

      fs.symlinkSync(installDir, toolchain);

      const TOOLCHAINS = await utils.parseBundleIDFromPropertyList(
        path.join(installDir, "Info.plist")
      );

      core.exportVariable("TOOLCHAINS", TOOLCHAINS);

      SWIFT_VERSION = await utils.commandLineMessage("xcrun", [
        "--toolchain",
        `"${TOOLCHAINS}"`,
        "--run",
        "swift",
        "--version",
      ]);
      break;
    case "ubuntu":
      SWIFT_VERSION = await utils.commandLineMessage(
        path.join(SWIFT_PATH, "swift"),
        ["--version"]
      );
      break;
    default:
      break;
  }

  SWIFT_VERSION = utils.parseVersionFromCommandLineMessage(SWIFT_VERSION);

  core.setOutput("swift-version", SWIFT_VERSION);
  core.info(`Successfully set up Swift (${SWIFT_VERSION})`);
}
