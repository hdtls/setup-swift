import * as tc from '@actions/tool-cache';

export {
  downloadTool,
  extractTar,
  extractXar,
  IToolRelease
} from '@actions/tool-cache';

export async function cacheDir(
  sourceDir: string,
  toolName: string,
  versionSpec: string,
  arch?: string
) {
  return await tc.cacheDir(sourceDir, toolName, versionSpec, arch);
}

export function find(toolName: string, versionSpec: string, arch?: string) {
  return tc.find(toolName, versionSpec, arch);
}
