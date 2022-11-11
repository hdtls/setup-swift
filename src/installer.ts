import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as io from "@actions/io";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as gpg from "./gpg";
import {
  getTempDirectory,
  getToolchainsDirectory,
  parseIDFromInfoPListAtDirectory,
  parseVersionFromLog,
  SWIFT_LATEST_XCTOOLCHAIN,
} from "./utils";
import * as exec from "@actions/exec";

const SWIFT_TOOL_CACHE_NAME = "swift";

export async function install(
  versionSpec: string,
  manifest: tc.IToolReleaseFile
) {
  if (tc.find(SWIFT_TOOL_CACHE_NAME, versionSpec)) {
    await exportVariables(versionSpec, manifest);
    return;
  }

  core.info(`Version ${versionSpec} was not found in the local cache`);

  let archivePath = "";
  let extractPath: string = "";

  switch (manifest.platform) {
    case "xcode":
      archivePath = await tc.downloadTool(
        manifest.download_url,
        path.join(getTempDirectory(), manifest.filename)
      );

      const { exitCode, stdout, stderr } = await exec.getExecOutput(
        "installer",
        ["-pkg", archivePath, "-target", "CurrentUserHomeDirectory"]
      );
      if (exitCode !== 0) {
        core.setFailed(stderr);
      }
      core.debug(stdout);

      const toolchain = manifest.filename.replace("-osx.pkg", ".xctoolchain");
      await tc.cacheDir(
        path.join(getToolchainsDirectory(), toolchain),
        SWIFT_TOOL_CACHE_NAME,
        versionSpec
      );
      break;
    case "ubuntu":
      archivePath = await tc.downloadTool(manifest.download_url);

      await gpg.importKeys();

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
      await tc.cacheDir(extractPath, SWIFT_TOOL_CACHE_NAME, versionSpec);
      break;
    case "windows":
      break;
    default:
      break;
  }

  await exportVariables(versionSpec, manifest);
}

async function exportVariables(
  versionSpec: string,
  manifest: tc.IToolReleaseFile
) {
  const installDir = tc.find(SWIFT_TOOL_CACHE_NAME, versionSpec);

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
  let SWIFT_PATH = "";

  switch (manifest.platform) {
    case "xcode":
      await io.mkdirP(getToolchainsDirectory());

      const toolchain = manifest.filename.replace("-osx.pkg", ".xctoolchain");
      SWIFT_PATH = path.join(getToolchainsDirectory(), toolchain);

      let TOOLCHAINS = "";

      if (fs.existsSync(SWIFT_PATH)) {
        TOOLCHAINS = parseIDFromInfoPListAtDirectory(SWIFT_PATH);

        const expect = parseIDFromInfoPListAtDirectory(installDir);
        if (TOOLCHAINS != expect) {
          await io.rmRF(SWIFT_PATH);
          fs.symlinkSync(installDir, SWIFT_PATH);
        }
      }

      if (fs.existsSync(SWIFT_LATEST_XCTOOLCHAIN)) {
        await io.rmRF(SWIFT_LATEST_XCTOOLCHAIN);
      }

      TOOLCHAINS = parseIDFromInfoPListAtDirectory(installDir);

      core.debug(`export TOOLCHAINS environment variable: ${TOOLCHAINS}`)

      SWIFT_VERSION = (
        await exec.getExecOutput("xcrun", [
          "--toolchain",
          `${TOOLCHAINS}`,
          "--run",
          "swift",
          "--version",
        ])
      ).stdout;

      core.exportVariable("TOOLCHAINS", TOOLCHAINS);
      break;
    case "ubuntu":
      SWIFT_VERSION = (
        await exec.getExecOutput(path.join(SWIFT_PATH, "swift"), ["--version"])
      ).stdout;
      SWIFT_PATH = installDir;
      break;
    default:
      break;
  }

  SWIFT_VERSION = parseVersionFromLog(SWIFT_VERSION);

  core.addPath(path.join(SWIFT_PATH, "/usr/bin"));

  core.setOutput("swift-version", SWIFT_VERSION);
  core.info(`Successfully set up Swift (${SWIFT_VERSION})`);
}
