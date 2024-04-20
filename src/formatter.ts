import { re, t, coerce } from './re';

export function parse(parseInput: string) {
  switch (true) {
    case re[t.SWIFTRELEASE].test(parseInput):
      parseInput = parseInput.replace(re[t.SWIFTRELEASE], '$1');
      return coerce(parseInput);
    case re[t.SWIFTNIGHTLY].test(parseInput):
      return parseInput.replace(re[t.SWIFTNIGHTLY], '$1+$5$6$7');
    case re[t.SWIFTMAINLINENIGHTLY].test(parseInput):
      return parseInput.replace(re[t.SWIFTMAINLINENIGHTLY], 'main+$1$2$3');
    default:
      throw new Error(`Cannot resolve semantic version from: ${parseInput}`);
  }
}
