import * as core from "@actions/core";
import * as os from "os";
import * as path from "path";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as gpg from "./gpg";
import * as manifest from "./manifest";
import { System, OS } from "./os";

//download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg
//download.swift.org/swift-5.7.1-release/ubuntu18.04/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu18.04.tar.gz.sig
const SWIFT_TOOLNAME = "Swift";

async function versionFromPath(commandLine: string) {
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

  await exec.exec(commandLine, ["--version"], options);

  const match = message.match(
    /Swift\ version (?<version>[0-9]+\.[0-9+]+(\.[0-9]+)?)/
  ) || {
    groups: { version: null },
  };

  if (!match.groups || !match.groups.version) {
    return null;
  }

  return match.groups.version;
}

export async function install(versionSpec: string, system: System) {
  let installDir = tc.find(SWIFT_TOOLNAME, versionSpec);
  const releaseFile = manifest.resolveReleaseFile(versionSpec, system);

  if (!installDir) {
    core.info(`Version ${versionSpec} was not found in the local cache`);
    core.info(`Version ${versionSpec} is available for downloading`);

    try {
      core.info(`Downloading Swift from ${releaseFile.download_url}`);
      const archivePath = await tc.downloadTool(releaseFile.download_url);

      let extractPath: string = "";

      switch (system.os) {
        case OS.MacOS:
          extractPath = await tc.extractXar(archivePath);
          const pkg = releaseFile.filename.replace(".pkg", "-package.pkg");
          extractPath = await tc.extractTar(
            path.join(extractPath, pkg, "Payload")
          );

          // const TOOLCHAINS = exec.exec("plutil", ["-extract", 'CFBundleIdentifier', "xml1", `${HOME}/Library/Developer/Toolchains/swift-${{ inputs.tag }}.xctoolchain/Info.plist | xmllint --xpath '//plist/string/text()' -)" >> $GITHUB_ENV
          const TOOLCHAINS = "";
          core.exportVariable("TOOLCHAINS", TOOLCHAINS);
          break;
        case OS.Ubuntu:
          await gpg.importKeys();

          core.info(
            `Downloading signature form ${releaseFile.download_url}.sig`
          );
          const signatureUrl = releaseFile.download_url + ".sig";
          const signature = await tc.downloadTool(signatureUrl);
          await gpg.verify(signature, archivePath);

          core.info("Extract downloaded archive");
          extractPath = await tc.extractTar(archivePath);
          break;
        case OS.Windows:
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
        `Version ${versionSpec} with platform ${system.name} not found`,
        `The list of all available versions can be found here: https://www.swift.org/download`,
      ].join(os.EOL)
    );
  }

  if (system.os === OS.MacOS) {
    // TOOLCHAINS =
  }

  core.info(`installDir: ${installDir}`);

  const binDir = path.join(installDir, releaseFile.filename, "/usr/bin");
  core.addPath(path.join(installDir, releaseFile.filename));
  core.addPath(binDir);

  const swiftPath = path.join(binDir, "swift");
  const swiftVersion = await versionFromPath(swiftPath);
  core.setOutput("swift-version", swiftVersion);
  core.setOutput("swift-path", swiftPath);

  core.info(`Successfully set up Swift (${swiftVersion})`);
}
