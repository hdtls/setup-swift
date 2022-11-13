import * as utils from '../src/utils';
import fs from 'fs';

jest.mock('fs');

describe('utils', () => {
  describe('version parse util', () => {
    it('parse version from swift version', async () => {
      const version = utils.getVersion(
        'swift-driver version: 1.62.15 Apple Swift version 5.7.1 (swiftlang-5.7.1.135.3 clang-1400.0.29.51)'
      );
      expect(version).toBe('5.7.1');
    });

    it('parse version from swift version with target', async () => {
      const version = utils.getVersion(
        `Apple Swift version 5.7.1 (swift-5.7.1-RELEASE)
Target: x86_64-apple-macosx12.0`
      );
      expect(version).toBe('5.7.1');
    });

    it('parse version from swift-driver version', async () => {
      const version = utils.getVersion(
        'swift-driver version: 1.26.9 Apple Swift version 5.5 (swiftlang-1300.0.31.1 clang-1300.0.29.1)'
      );
      expect(version).toBe('5.5');
    });

    it('parse version from empty string', async () => {
      const version = utils.getVersion('');
      expect(version).toBe('');
    });

    it("parse version from string that doesn't contains valid version string", async () => {
      const version = utils.getVersion(
        'swift-driver version: 1.62.15 Apple Swift version'
      );
      expect(version).toBe('');
    });

    it('parse version from trunk development snapshot swift version', async () => {
      const version = utils.getVersion(
        `Apple Swift version 5.8-dev (LLVM fc8da753996192c, Swift 9ad73a69a5a99ba)
Target: x86_64-apple-macosx12.0`
      );
      expect(version).toBe('5.8-dev');
    });

    it('parse version from development snapshot swift version', async () => {
      const version = utils.getVersion(
        `Apple Swift version 5.7.1-dev (LLVM 597c04db307f4ed, Swift 2e814ca5d704c9f)
Target: x86_64-apple-macosx12.0`
      );
      expect(version).toBe('5.7.1-dev');
    });
  });

  describe('linux distrib parse util', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    it.each([
      [
        'ubuntu',
        `PRETTY_NAME="Ubuntu 22.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.1 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
root@77515d0efe9e:/# cat /etc/lsb-release 
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.1 LTS"`,
        'ubuntu',
        '22.04'
      ],
      [
        'amzn',
        `NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"`,
        'amazonlinux',
        '2'
      ],
      [
        'centos',
        `NAME="CentOS Linux"
VERSION="8"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="8"
PLATFORM_ID="platform:el8"
PRETTY_NAME="CentOS Linux 8"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:8"
HOME_URL="https://centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"
CENTOS_MANTISBT_PROJECT="CentOS-8"
CENTOS_MANTISBT_PROJECT_VERSION="8"`,
        'centos',
        '8'
      ]
    ])(
      'read distrib id and release version for %s',
      (a, __DISTRIB__, distrib_id, distrib_release) => {
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => __DISTRIB__);

        expect(jest.isMockFunction(fs.existsSync)).toBeTruthy();
        expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();

        expect(utils.getLinuxDistribID()).toBe(distrib_id);
        expect(utils.getLinuxDistribRelease()).toBe(distrib_release);
      }
    );
  });
});
