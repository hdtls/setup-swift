import * as fs from 'fs';

/**
 * Extract Swift version from given stdout message
 *
 * @param message stdout message
 * @returns Swift version if success or empty
 */
export function extractVerFromLogMessage(message: string) {
  const re = /.*Swift version (\d+\.\d+(\.\d+)?(-dev)?).*/is;
  return re.test(message) ? message.replace(re, '$1') : '';
}

export var __DISTRIB__: string | undefined;

function _getLinuxDistrib() {
  /*
    Ubuntu os-release:
      PRETTY_NAME="Ubuntu 22.04.1 LTS"
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
  
    Amazon Linux os-release:
      NAME="Amazon Linux"
      VERSION="2"
      ID="amzn"
      ID_LIKE="centos rhel fedora"
      VERSION_ID="2"
      PRETTY_NAME="Amazon Linux 2"
      ANSI_COLOR="0;33"
      CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
      HOME_URL="https://amazonlinux.com/"
    
    CentOS os-release:
      NAME="CentOS Linux"
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
      CENTOS_MANTISBT_PROJECT_VERSION="8"
  */
  const osReleaseFile = '/etc/os-release';

  if (fs.existsSync(osReleaseFile)) {
    return fs.readFileSync(osReleaseFile).toString();
  }
  return '';
}

/**
 * Gets Linux release version
 */
export function getLinuxDistribRelease() {
  const __DISTRIB__ = _getLinuxDistrib();

  return (
    __DISTRIB__.match(/VERSION_ID="(?<distrib_release>.*)"/)?.groups
      ?.distrib_release || ''
  );
}

/**
 * Gets and resolve Linux distrib id
 */
export function getLinuxDistribID() {
  let distrib_id = _getLinuxDistrib()
    .split('\n')
    .map(
      line =>
        line.trim().match(/^ID="?(?<distrib_id>.*)"?/)?.groups?.distrib_id || ''
    )
    .filter(line => line.length > 0)
    .map(line => line.replace(/['"]+/g, ''))
    .reverse()
    .pop();

  return distrib_id == 'amzn' ? 'amazonlinux' : distrib_id || '';
}
