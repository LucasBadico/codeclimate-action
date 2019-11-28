#! /usr/bin/env node
const { run } = require('../lib/main');

run().catch(er => console.error('Connectio error, coverage not sended to codeclimate'));