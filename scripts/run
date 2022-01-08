#!/usr/bin/env node
const nps = require('path')
const { Command } = require('commander')

const program = new Command()

program
  .description('monorepo script')
  .command('test', 'jest test')
  .command('build', 'tsc build')
  .command('packlimit', '检测包大小')
  .command('pkgxo', 'pkgxo')

program.parse(process.argv)
