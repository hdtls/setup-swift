import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';
import * as toolchains from '../src/toolchains';

const workDir = path.join(__dirname, 'TEMP');

describe('toolchains', () => {
  beforeEach(async () => {
    await io.rmRF(workDir);
    await io.mkdirP(workDir);
  });

  afterAll(async () => {
    await io.rmRF(workDir);
  });

  it('extract bundle identifier from Xcode default toolchain', async () => {
    const expected = 'com.apple.dt.toolchain.XcodeDefault';
    const contents = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Identifier</key>
	<string>com.apple.dt.toolchain.XcodeDefault</string>
</dict>
</plist>
`;
    fs.writeFileSync(path.join(workDir, 'ToolchainInfo.plist'), contents);
    const actual = toolchains.parseBundleIDFromDirectory(workDir);
    expect(actual).toBe(expected);
  });

  it('extract bundle identifier from custom installed toolchain', async () => {
    const expected = 'org.swift.580202303301a';
    const contents = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Aliases</key>
	<array>
		<string>swift</string>
	</array>
	<key>CFBundleIdentifier</key>
	<string>${expected}</string>
	<key>CompatibilityVersion</key>
	<integer>2</integer>
	<key>CompatibilityVersionDisplayString</key>
	<string>Xcode 8.0</string>
	<key>CreatedDate</key>
	<date>2023-03-30T22:07:27Z</date>
	<key>DisplayName</key>
	<string>Swift 5.8 Release 2023-03-30 (a)</string>
	<key>OverrideBuildSettings</key>
	<dict>
		<key>ENABLE_BITCODE</key>
		<string>NO</string>
		<key>SWIFT_DEVELOPMENT_TOOLCHAIN</key>
		<string>YES</string>
		<key>SWIFT_DISABLE_REQUIRED_ARCLITE</key>
		<string>YES</string>
		<key>SWIFT_LINK_OBJC_RUNTIME</key>
		<string>YES</string>
		<key>SWIFT_USE_DEVELOPMENT_TOOLCHAIN_RUNTIME</key>
		<string>YES</string>
	</dict>
	<key>ReportProblemURL</key>
	<string>https://bugs.swift.org/</string>
	<key>ShortDisplayName</key>
	<string>Swift 5.8 Release</string>
	<key>Version</key>
	<string>5.8.20230330101</string>
</dict>
</plist>
`;
    fs.writeFileSync(path.join(workDir, 'Info.plist'), contents);
    const actual = toolchains.parseBundleIDFromDirectory(workDir);
    expect(actual).toBe(expected);
  });

  it('extract bundle identifier from wrong directory', () => {
    const actual = toolchains.parseBundleIDFromDirectory(workDir);
    expect(actual).toBe('');
  });
});
