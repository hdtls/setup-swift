/**
 * Semantic version RegExp
 */
export const SWIFT_SEMANTIC_VERSION = /^\d+(\.\d+)?(\.\d+)?$/;

/**
 * Swift release RegExp
 */
export const SWIFT_RELEASE = /^swift-(\d+\.\d+(\.\d+)?)-RELEASE$/;

/**
 * Swift nightly(development snapshot) RegExp
 */
export const SWIFT_NIGHTLY =
  /^(swift|nightly)-(\d+\.\d+)(-DEVELOPMENT-SNAPSHOT-.+-a)?$/;

/**
 * Swift nightly(mainline development snapshot) RegExp
 */
export const SWIFT_MAINLINE_NIGHTLY =
  /^(nightly(-main)?|swift-DEVELOPMENT-SNAPSHOT-.+-a)$/;

/**
 * Swift TOOLCHAINS RegExp
 */
export const TOOLCHAINS =
  /(CFBundle)?Identifier<\/key>\n*\t*<string>(?<TOOLCHAINS>.*)<\/string>/;
