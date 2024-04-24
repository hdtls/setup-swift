# setup-swift

[![integration-tests](https://github.com/hdtls/setup-swift/actions/workflows/integration-tests.yml/badge.svg?branch=main)](https://github.com/hdtls/setup-swift/actions/workflows/integration-tests.yml)

This action provides the following functionality for GitHub Actions users:

- Installing a version of Swift and (by default) adding it to the PATH

## Basic usage

See [action.yml](action.yml)

**Swift**
```yaml
steps:
- uses: actions/checkout@v3
- uses: hdtls/setup-swift@main
  with:
    swift-version: '5.7.1'
- run: swift --version
```

The `swift-version` input is required.

The action will first check the local [tool cache](docs/advanced-usage.md#hosted-tool-cache) for a [semver](https://github.com/npm/node-semver#versions) match. If unable to find a specific version in the tool cache, the action will attempt to download a version of Swift from [Swift Releases](https://www.swift.org/download/).

## Supported version syntax

The `swift-version` input supports the [Semantic Versioning Specification](https://semver.org/) and some special version notations (e.g. `swift-x.y-RELEASE`, `nightly`, `nightly-x.y`, etc.), for detailed examples please refer to the section: [Using swift-version input](docs/advanced-usage.md#using-the-swift-version-input) of the [Advanced usage](docs/advanced-usage.md) guide.

## Advanced usage

- [Using the swift-version input](docs/advanced-usage.md#using-the-swift-version-input)
- [Outputs and environment variables](docs/advanced-usage.md#outputs-and-environment-variables)
- [Available versions of Swift](docs/advanced-usage.md#available-versions-of-swift)

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

## Contributions

Contributions are welcome!
