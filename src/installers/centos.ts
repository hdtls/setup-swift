import * as tc from '../tool-cache';
import * as defaults from './defaults';

/**
 * Download and install tools define in manifest files
 *
 * @param manifest informations of tool
 */
export async function install(manifest: tc.IToolRelease) {
  await defaults.install(manifest);
}

/**
 * Export path or any other relative variables
 *
 * @param manifest manifest for installed tool
 * @param toolPath installed tool path
 */
export async function exportVariables(
  manifest: tc.IToolRelease,
  toolPath: string
) {
  await defaults.exportVariables(manifest, toolPath);
}
