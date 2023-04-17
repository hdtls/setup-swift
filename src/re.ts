const re: RegExp[] = [];
const src: string[] = [];
const t: { [key: string]: number } = {};
let R = 0;

function createToken(name: string, value: string, flags?: string) {
  const index = R++;
  t[name] = index;
  src[index] = value;
  re[index] = new RegExp(value, flags);
}

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '[0-9]+');

// ## Main Version
// Three dot-separated numeric identifiers. patch version can be undefined
createToken(
  'MAINVERSION',
  `(${src[t.NUMERICIDENTIFIER]})\\.` +
    `(${src[t.NUMERICIDENTIFIER]})` +
    `(\\.(${src[t.NUMERICIDENTIFIER]}))?`
);

// ## TOOLCHAIN
createToken(
  'TOOLCHAINS',
  '(CFBundle)?Identifier</key>\n*\t*<string>(?<TOOLCHAINS>.*)</string>'
);

// ## Swift RELEASE tag
// Combination of `swift-`, `MAINVERSION` and `-RELEASE`.
createToken('SWIFTRELEASE', `^swift-(${src[t.MAINVERSION]})-RELEASE$`);

// ## Swift development snapshot tag suffix
createToken(
  'DEVELOPMENTSNAPSHOT',
  '-DEVELOPMENT-SNAPSHOT-' +
    `(${src[t.NUMERICIDENTIFIER]})-` +
    `(${src[t.NUMERICIDENTIFIER]})-` +
    `(${src[t.NUMERICIDENTIFIER]})-a`
);

// ## Swift branch specified nightly tag
createToken(
  'SWIFTNIGHTLY',
  `^swift-(${src[t.MAINVERSION]})${src[t.DEVELOPMENTSNAPSHOT]}$`
);

createToken('SWIFTNIGHTLYLOOSE', `^nightly-(${src[t.MAINVERSION]})$`);

// ## Swift mainline nightly tag
createToken(
  'SWIFTMAINLINENIGHTLY',
  `(?:^swift${src[t.DEVELOPMENTSNAPSHOT]}$|^nightly(?:-main)?$)`
);

export { re, src, t };
