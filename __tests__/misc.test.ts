import { resolveVersionFromMessage } from "../src/misc";

describe("version lookup", () => {
  it("identifies version from swift version", async () => {
    const version = resolveVersionFromMessage(
      "Apple Swift version 5.4.2 (swiftlang-1205.0.28.2 clang-1205.0.19.57)"
    );
    expect(version).toBe("5.4.2");
  });

  it("identifies version from swift version with target", async () => {
    const version = resolveVersionFromMessage(
      `Apple Swift version 5.5 (swiftlang-1300.0.31.1 clang-1300.0.29.1)
Target: x86_64-apple-macosx11.0`
    );
    expect(version).toBe("5.5");
  });

  it("identifies version from swift-driver version", async () => {
    const version = resolveVersionFromMessage(
      "swift-driver version: 1.26.9 Apple Swift version 5.5 (swiftlang-1300.0.31.1 clang-1300.0.29.1)"
    );
    expect(version).toBe("5.5");
  });

  it("identifies version from swift version on linux", async () => {
    const version = resolveVersionFromMessage(
      "Swift version 5.5.1 (swift-5.5.1-RELEASE)"
    );
    expect(version).toBe("5.5.1");
  });
});
