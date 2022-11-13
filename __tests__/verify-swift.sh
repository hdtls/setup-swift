#!/bin/bash

if [ -z "$1" ]; then
  echo "Must supply swift version argument"
  exit 1
fi

parse_expect_version() {
  if [[ "$1" =~ ^[0-9]\.[0-9](\.[0-9])?$ ]]; then
    expected="$1"
  fi

  if [[ "$1" =~ ^[0-9]\.[0-9](\/[0-9])?-dev$ ]]; then
    expected="$1"
  fi

  if [[ "$1" =~ ^swift-([0-9]\.[0-9](\.[0-9])?)-RELEASE$ ]]; then
    expected="${BASH_REMATCH[1]}"
  fi

  if [[ "$1" =~ ^swift-([0-9]\.[0-9](\.[0-9])?)-DEVELOPMENT-SNAPSHOT ]]; then
    expected="${BASH_REMATCH[1]}-dev"
  fi
}

parse_version_from_log() {
  if [[ "$1" =~ ([0-9]\.[0-9](\.[0-9])?(-dev)?) ]]; then
    swift_version="${BASH_REMATCH[1]}"
  fi
}

parse_expect_version "$1"
parse_version_from_log "$(swift --version)"

if [[ $swift_version != $expected ]]; then
  echo "AssertEqual 'swift --version' and $expected failed: $swift_version is not equal to $expected ("$1")"
  exit 1
else
  echo "AssertEqual 'swift --version' and $expected ("$1") success"
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  parse_version_from_log "$(xcrun swift --version)"
  if [[ $swift_version != $expected ]]; then
    echo "AssertEqual 'xcrun swift --version' and $expected failed: $swift_version is not equal to $expected ("$1")"
    exit 1
  else
    echo "AssertEqual 'xcrun swift --version' and $expected ("$1") success"
  fi
fi