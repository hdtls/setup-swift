import * as core from "@actions/core";
import * as os from "os";
import * as path from "path";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as gpg from "./gpg";
import { resolveVersionFromCommandLine } from "./misc";

//download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg
//download.swift.org/swift-5.7.1-release/ubuntu18.04/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu18.04.tar.gz.sig
const SWIFT_TOOLNAME = "Swift";

export async function install(
  versionSpec: string,
  manefest: tc.IToolReleaseFile
) {
  let installDir = tc.find(SWIFT_TOOLNAME, versionSpec);

  if (!installDir) {
    core.info(`Version ${versionSpec} was not found in the local cache`);
    core.info(`Version ${versionSpec} is available for downloading`);

    try {
      core.info(`Downloading Swift from ${manefest.download_url}`);
      const archivePath = await tc.downloadTool(manefest.download_url);

      let extractPath: string = "";

      switch (manefest.platform) {
        case "xcode":
          extractPath = await tc.extractXar(archivePath);
          const pkg = manefest.filename.replace(".pkg", "-package.pkg");
          extractPath = await tc.extractTar(
            path.join(extractPath, pkg, "Payload")
          );

          // const TOOLCHAINS = exec.exec("plutil", ["-extract", 'CFBundleIdentifier', "xml1", `${HOME}/Library/Developer/Toolchains/swift-${{ inputs.tag }}.xctoolchain/Info.plist | xmllint --xpath '//plist/string/text()' -)" >> $GITHUB_ENV
          const TOOLCHAINS = "";
          core.exportVariable("TOOLCHAINS", TOOLCHAINS);
          break;
        case "ubuntu":
          await gpg.importKeys();

          core.info(`Downloading signature form ${manefest.download_url}.sig`);
          const signatureUrl = manefest.download_url + ".sig";
          const signature = await tc.downloadTool(signatureUrl);
          await gpg.verify(signature, archivePath);

          core.info("Extract downloaded archive");
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

    installDir = tc.find(SWIFT_TOOLNAME, versionSpec);
  }

  if (!installDir) {
    throw new Error(
      [
        `Version ${versionSpec} with platform ${manefest.platform}${
          manefest.platform_version || ""
        } not found`,
        `The list of all available versions can be found here: https://www.swift.org/download`,
      ].join(os.EOL)
    );
  }

  if (manefest.platform === "xcode") {
    // TOOLCHAINS =
  }

  const SWIFT_PLATFORM = `${manefest.platform}${
    manefest.platform_version || ""
  }`;
  const SWIFT_VERSION = `swift-${versionSpec}-RELEASE-${SWIFT_PLATFORM}`;

  const binDir = path.join(installDir, SWIFT_VERSION, "/usr/bin");

  core.addPath(path.join(installDir, SWIFT_VERSION));
  core.addPath(binDir);

  const SWIFT_PATH = path.join(binDir, "swift");
  const swiftVersion = await resolveVersionFromCommandLine(SWIFT_PATH);
  core.setOutput("swift-version", swiftVersion);
  core.setOutput("swift-path", SWIFT_PATH);

  core.info(`Successfully set up Swift (${swiftVersion})`);
}
