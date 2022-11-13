import * as core from '@actions/core';
import * as tc from './tool-cache';
import * as toolchains from './toolchains';

export function findSwift(manifest: tc.IToolRelease) {
  let RE = /^swift-(?<version>[\d]\.[\d](\.[\d])?)-RELEASE$/;
  let toolPath = '';

  if (RE.test(manifest.version)) {
    toolPath = tc.find(
      'swift',
      manifest.version.match(RE)![0],
      manifest.files[0].arch
    );
    if (toolPath) {
      return toolPath;
    }
  }

  toolPath = tc.find('swift', manifest.version, manifest.files[0].arch);

  // If not found in cache, download
  if (toolPath) {
    return toolPath;
  }

  core.info(`Version ${manifest.version} was not found in the local cache`);
  return '';
}
