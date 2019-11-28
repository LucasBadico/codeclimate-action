#! /usr/bin/env node
const { run } = require('../lib/main');
const {
    env: {
        DEBUG,
        COVERAGE_COMMAND,
        SILENT_MODE,
    }
}
const args = [
    undefined, // downloadURL
    undefined, // Executable
    COVERAGE_COMMAND,
    DEBUG,
    SILENT_MODE,
]
run(...args)
    .then(msg => console.log(msg))
    .catch( msg => console.error(msg));