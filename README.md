# codeclimate-hook

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A hook, with `send-coverage` command, that send the corevage report to [Code Climate](http://codeclimate.com/).

## Usage
### Setup the coverage command:
```json
"coverage": "CC_TEST_REPORTER_ID=YOUR_REPORTID yarn send-coverage",
```

#### Use in the hook helper(in this case husky):
```json
"husky": {
    "hooks": {
      "pre-push": "yarn coverage"
    }
  },
```

#### Or call it manually:

```bash
yarn coverage
```

### ENV VARIABLES

- [`CC_TEST_REPORTER_ID`](https://docs.codeclimate.com/docs/configuring-test-coverage) [required]: You can find it under Repo Settings in your Code Climate project.
- `DEBUG` [default: `false`]: useful for initial configuration.
- `COVERAGE_COMMAND` [default: `yarn test` ]: The command that runs the tests and generate the coverage report.
- `SILENT_MODE` [default: `true`]: For not breaking any flow if anything goes wrong, so if you setup a `pre-commit` hook and you don't want your time to kill you when any tests breaks or they are with no internet to send the report.
