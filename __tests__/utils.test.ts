import { parseVersionFromLog } from "../src/utils";

describe("utils", () => {
  describe("version parse util", () => {
    it("parse version from swift version", async () => {
      const version = parseVersionFromLog(
        "swift-driver version: 1.62.15 Apple Swift version 5.7.1 (swiftlang-5.7.1.135.3 clang-1400.0.29.51)"
      );
      expect(version).toBe("5.7.1");
    });

    it("parse version from swift version with target", async () => {
      const version = parseVersionFromLog(
        `Apple Swift version 5.7.1 (swift-5.7.1-RELEASE)
Target: x86_64-apple-macosx12.0`
      );
      expect(version).toBe("5.7.1");
    });

    it("parse version from swift-driver version", async () => {
      const version = parseVersionFromLog(
        "swift-driver version: 1.26.9 Apple Swift version 5.5 (swiftlang-1300.0.31.1 clang-1300.0.29.1)"
      );
      expect(version).toBe("5.5");
    });

    it("parse version from empty string", async () => {
      const version = parseVersionFromLog("");
      expect(version).toBe("");
    });

    it("parse version from string that doesn't contains valid version string", async () => {
      const version = parseVersionFromLog(
        "swift-driver version: 1.62.15 Apple Swift version"
      );
      expect(version).toBe("");
    });
  });
});
