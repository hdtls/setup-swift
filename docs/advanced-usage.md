# Advanced Usage
- [Using the swift-version input](advanced-usage.md#using-the-swift-version-input)
    - [Specifying a Swift version](advanced-usage.md#specifying-a-swift-version)
    - [Matrix Testing](advanced-usage.md#matrix-testing)
- [Outputs and environment variables](advanced-usage.md#outputs-and-environment-variables)
    - [Outputs](advanced-usage.md#outputs)
    - [Environment variables](advanced-usage.md#environment-variables)
- [Available versions of Swift](advanced-usage.md#available-versions-of-swift)
    - [Swift](advanced-usage.md#swift)
- [Hosted tool cache](advanced-usage.md#hosted-tool-cache) 

## Using the `swift-version` input

### Specifying a Swift version

If there is a specific version of Swift that you need and you don't want to worry about any potential breaking changes due to patch updates, you should specify the **exact major, minor, and patch version** (such as `5.7.1` or `swift-5.7.1-RELEASE`):

```yaml
steps:
- uses: actions/checkout@v3
- uses: hdtls/setup-swift@main
  with:
    swift-version: '5.7.1' 
- run: swift --version
```

You can specify **only a major and minor version** if you are okay with the most recent patch version being used:

```yaml
steps:
- uses: actions/checkout@v3
- uses: hdtls/setup-swift@main
  with:
    swift-version: '5.7' 
- run: swift --version
```

It is also possible to specify the version with **nightly tag** or **development snapshot** to download and set up an nightly version of Swift (such as `nightly` `nightly-5.7` or `swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a`):

```yaml
steps:
- uses: actions/checkout@v3
- uses: hdtls/setup-swift@main
  with:
    swift-version: 'nightly'
- run: swift --version
```
- The `nightly`, `nightly-main` and `swift-DEVELOPMENT-SNAPSHOT-xxxx-xx-xx-a` will resolve to latest build of trunk development (main) that created from mainline development branches.
- The `nightly-x.y` and `swift-x.y-DEVELOPMENT-SNAPSHOT-xxxx-xx-xx-a` will be resolve to latest build of `x.y` development that created from `release/x.y` branch.


### Matrix Testing

Using `setup-swift` it's possible to use [matrix syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) to install several versions of Swift:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        swift-version: ['5.7.1', 'swift-5.6.3-RELEASE', 'nightly', 'nightly-5.7', 'swift-DEVELOPMENT-SNAPSHOT-2022-12-05-a', 'swift-5.7-DEVELOPMENT-SNAPSHOT-2022-10-03-a']
    steps:
      - uses: actions/checkout@v3
      - name: Set up Swift
        uses: hdtls/setup-swift@main
        with:
          swift-version: ${{ matrix.swift-version }}
      - name: Display Swift version
        run: swift --version
```


# Outputs and environment variables

## Outputs

### `swift-version`

Using **swift-version** output it's possible to get the installed by action Swift version.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: hdtls/setup-swift@main
      id: cp310
      with:
        swift-version: "5.7.1"
    - run: echo '${{ steps.cp310.outputs.swift-version }}'
```

### `swift-path`

**swift-path** output is available with the absolute path of the Swift interpreter executable if you need it.

## Environment variables

These environment variables become available after setup-swift action execution:

| **Env.variable**      | **Description** |
| ----------- | ----------- |
| TOOLCHAINS      |Contains the identifier of the installed Swift toolchain (macOS only)|

## Available versions of Swift
### Swift

`setup-swift` is able to configure **Swift** from:

- Downloadable versions from Swift Releases ([Swift Release](https://www.swift.org/download/)).
    - If there is a specific version of Swift that is not available, you can open an issue here

## Hosted tool cache

This tool cache helps speed up runs and tool setup by not requiring any new downloads. There is an environment variable called `RUNNER_TOOL_CACHE` on each runner that describes the location of the tool cache with Swift installed. `setup-swift` works by taking a specific version of Swift from this tool cache and adding it to PATH.

|| Location |
|------|-------|
|**Tool cache Directory** |`RUNNER_TOOL_CACHE`|
|**Swift tool cache**|`RUNNER_TOOL_CACHE/swift/*`|

GitHub runner images are set up in [actions/runner-images](https://github.com/actions/runner-images). During the setup, the available versions of Swift are automatically downloaded, set up and documented.
