import * as formatter from '../src/formatter';

describe('formatter', () => {
  it.each([
    ['swift-5.0-RELEASE', '5.0.0'],
    ['swift-5.9.2-RELEASE', '5.9.2'],
    ['swift-6.0-DEVELOPMENT-SNAPSHOT-2024-04-17-a', '6.0+20240417'],
    ['swift-DEVELOPMENT-SNAPSHOT-2024-04-13-a', 'main+20240413']
  ])('parse sermatic version from', (parseInput, expected) => {
    const parseOutput = formatter.parse(parseInput);
    expect(parseOutput).toBe(expected);
  });

  it('parse semantic version from unsupported string', () => {
    expect(() => {
      formatter.parse('unsupported');
    }).toThrow('Cannot resolve semantic version from: unsupported');
  });
});
