import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as semver from "semver";
import * as os from "node:os";
import { System, OS } from "./system";

const SWIFT_WEBROOT = "https://download.swift.org";

const VERSIONS_LIST: [string, OS[]][] = [
  ["5.7.1", OS.all()],
  ["5.7", [OS.MacOS, OS.Ubuntu]],
  ["5.6.3", OS.all()],
  ["5.6.2", OS.all()],
  ["5.6.1", OS.all()],
  ["5.6", OS.all()],
  ["5.5.3", OS.all()],
  ["5.5.2", OS.all()],
  ["5.5.1", OS.all()],
  ["5.5", OS.all()],
  ["5.4.3", OS.all()],
  ["5.4.2", OS.all()],
  ["5.4.1", OS.all()],
  ["5.4", OS.all()],
  ["5.3.3", OS.all()],
  ["5.3.2", OS.all()],
  ["5.3.1", OS.all()],
  ["5.3", OS.all()],
  ["5.2.5", [OS.Ubuntu]],
  ["5.2.4", [OS.MacOS, OS.Ubuntu]],
  ["5.2.3", [OS.Ubuntu]],
  ["5.2.2", [OS.MacOS, OS.Ubuntu]],
  ["5.2.1", [OS.Ubuntu]],
  ["5.2", [OS.MacOS, OS.Ubuntu]],
  ["5.1.5", [OS.Ubuntu]],
  ["5.1.4", [OS.Ubuntu]],
  ["5.1.3", [OS.MacOS, OS.Ubuntu]],
  ["5.1.2", [OS.MacOS, OS.Ubuntu]],
  ["5.1.1", [OS.Ubuntu]],
  ["5.1", [OS.MacOS, OS.Ubuntu]],
  ["5.0.3", [OS.Ubuntu]],
  ["5.0.2", [OS.Ubuntu]],
  ["5.0.1", [OS.MacOS, OS.Ubuntu]],
  ["5.0", [OS.MacOS, OS.Ubuntu]],
  ["4.2.4", [OS.Ubuntu]],
  ["4.2.3", [OS.Ubuntu]],
  ["4.2.2", [OS.Ubuntu]],
  ["4.2.1", [OS.MacOS, OS.Ubuntu]],
  ["4.2", [OS.MacOS, OS.Ubuntu]],
  ["4.1.3", [OS.Ubuntu]],
  ["4.1.2", [OS.MacOS, OS.Ubuntu]],
  ["4.1.1", [OS.Ubuntu]],
  ["4.1", [OS.MacOS, OS.Ubuntu]],
  ["4.0.3", [OS.MacOS, OS.Ubuntu]],
  ["4.0.2", [OS.MacOS, OS.Ubuntu]],
  ["4.0", [OS.MacOS, OS.Ubuntu]],
  ["3.1.1", [OS.MacOS, OS.Ubuntu]],
  ["3.1", [OS.MacOS, OS.Ubuntu]],
  ["3.0.2", [OS.MacOS, OS.Ubuntu]],
  ["3.0.1", [OS.MacOS, OS.Ubuntu]],
  ["3.0", [OS.MacOS, OS.Ubuntu]],
  ["2.2.1", [OS.MacOS, OS.Ubuntu]],
  ["2.2", [OS.MacOS, OS.Ubuntu]],
];

//download.swift.org/swift-5.7.1-release/ubuntu2204/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04.tar.gz
//download.swift.org/swift-5.7.1-release/ubuntu2204-aarch64/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-ubuntu22.04-aarch64.tar.gz
//download.swift.org/swift-5.7.1-release/xcode/swift-5.7.1-RELEASE/swift-5.7.1-RELEASE-osx.pkg
export function resolveReleaseFile(
  versionSpec: string,
  system: System
): tc.IToolReleaseFile {
  let platform: string;
  let platformVersion: string | undefined;
  let filename: string;

  switch (system.os) {
    case OS.MacOS:
      platform = "xcode";
      filename = `swift-${versionSpec}-RELEASE-osx.pkg`;
      break;
    case OS.Ubuntu:
      core.info(
        `${os.arch()}, ${os.platform()}, ${os.release()}, ${os.version()}`
      );
      platform = `ubuntu`;
      platformVersion = system.version;
      filename = `swift-${versionSpec}-RELEASE-${platform}${platformVersion}.tar.gz`;
      break;
    case OS.Windows:
      platform = "windows";
      platformVersion = "10";
      filename = `swift-${versionSpec}-RELEASE-${platform}${platformVersion}.exe`;
      break;
    default:
      throw new Error("Cannot create release file for an unsupported OS");
  }

  const SWIFT_BRANCH = `swift-${versionSpec}-release`;
  const SWIFT_WEBDIR = `${SWIFT_WEBROOT}/${SWIFT_BRANCH}/${platform}${
    platformVersion?.replace(".", "") || ""
  }`;
  return {
    filename: filename,
    platform: platform,
    platform_version: platformVersion,
    arch: process.arch,
    download_url: `${SWIFT_WEBDIR}/swift-${versionSpec}-RELEASE/${filename}`,
  };
}

export function evaluateVersion(version: string, system: System) {
  let range = semver.validRange(version);
  if (range === null) {
    throw new Error("Version range is invalid");
  }

  let versions = VERSIONS_LIST.filter(([_, os]) => os.includes(system.os)).map(
    ([version, _]) => semver.coerce(version)!.version
  );

  const semanticVersion = semver.coerce(tc.evaluateVersions(versions, version));

  return !semanticVersion
    ? ""
    : `${semanticVersion.major}.${semanticVersion.minor}${
        semanticVersion.patch > 0 ? `.${semanticVersion.patch}` : ""
      }`;
}
