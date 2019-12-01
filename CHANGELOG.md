# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [2.3.0] - 2019-10-31
### Added
- Debug support - via [`#45`](https://github.com/paambaati/codeclimate-action/pull/45).

# [2.2.6] - 2019-10-31
### Fixed
- `env` issues introduced after the Husky-related fixes.

# [2.2.5] - 2019-10-29
### Fixed
- Remove `husky` as a dependency.

### Changed
- Automated releases thanks to [`technote-space/release-github-actions`](https://github.com/technote-space/release-github-actions).

# [2.2.4] - 2019-10-27
### Fixed
- Fix [missing files](https://github.com/paambaati/codeclimate-action/issues/42#issuecomment-546676537).

# [2.2.3] - 2019-10-27
### Fixed
- Fix [runtime failures](https://github.com/paambaati/codeclimate-action/issues/42#issuecomment-546659123) - via [`0a0ba88`](https://github.com/paambaati/codeclimate-action/commit/0a0ba88ef1092c69d5be6235dc6d493a699ffb1a) and [`c2422ad`](https://github.com/paambaati/codeclimate-action/commit/c2422ad00a34ed3524226d5d1e2124e05a970874).

# [2.2.2] - 2019-10-27
### Fixed
- Code coverage will also be available in 'Overview' tab - via [#43](https://github.com/paambaati/codeclimate-action/pull/43).

## [2.2.1] - 2019-09-19
### Changed
- Upgrade to `@actions/core` v1.1.1 - via [#20](https://github.com/paambaati/codeclimate-action/pull/20).

## [2.2.0] - 2019-08-28
### Fixed
- Inject `GITHUB_` environment vars as CC-specific ones - via [#3](https://github.com/paambaati/codeclimate-action/pull/3). Thanks @b4nst!

## [2.1.0] - 2019-08-16
### Added
- Release script.

### Changed
- ⚡️ Replaced `got` with `node-fetch`. Now the action should run faster!

## [2.0.0] - 2019-08-14
### Changed
- ⚡️ Change from Docker to JavaScript.

## [1.0.0] - 2019-08-09
### Added
- Initial release.
