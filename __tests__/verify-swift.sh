#!/bin/bash

if [ -z "$1" ]; then
  echo "Must supply swift version argument"
  exit 1
fi

parse_expect_version() {
  if [[ "$1" =~ ^[0-9]+\.[0-9]+(\.[0-9]+)?(-dev)?$ ]]; then
    expected="$1"
  elif [[ "$1" =~ ^swift-([0-9]+\.[0-9]+(\.[0-9]+)?)-RELEASE$ ]]; then
    expected="${BASH_REMATCH[1]}"
  
  # The version number of DEVELOPMENT-SNAPSHOT is ambiguous
  # there if not contains PATCH number we will use a RegEx test instead.
  elif [[ "$1" =~ ^swift-([0-9])+\.([0-9])+(\.([0-9])+)?-DEVELOPMENT-SNAPSHOT ]]; then
    local MAJOR="${BASH_REMATCH[1]}"
    local MINOR="${BASH_REMATCH[2]}"
    local PATCH="${BASH_REMATCH[4]}"

    if [[ -n "$PATCH" ]]; then
      expected="$MAJOR.$MINOR.$PATCH-dev"
    else
    expected="$MAJOR.$MINOR(\.[0-9]+)?-dev"
    fi
  else
    exit 1
  fi
}

parse_version_from_log() {
  if [[ "$1" =~ ([0-9]+\.[0-9]+(\.[0-9]+)?(-dev)?) ]]; then
    swift_version="${BASH_REMATCH[1]}"
  fi
}

parse_expect_version "$1"
parse_version_from_log "$(swift --version)"

if [[ $swift_version =~ $expected ]]; then
  echo "Assert RegEx Match 'swift --version ($swift_version)' and $expected ("$1") success"
else
  echo "Assert RegEx Match 'swift --version ($swift_version)' and $expected failed: $swift_version is not match to $expected ("$1")"
  exit 1
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  parse_version_from_log "$(xcrun swift --version)"
  if [[ $swift_version =~ $expected ]]; then
    echo "Assert RegEx Match 'xcrun swift --version ($swift_version)' and $expected ("$1") success"
  else
    echo "Assert RegEx Match 'xcrun swift --version ($swift_version)' and $expected failed: $swift_version is not match to $expected ("$1")"
    exit 1
  fi
fi