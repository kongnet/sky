#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
let Pack = require('./package.json')
commander
  .usage('[options] ')
  .version(`[${$.c.g(Pack.version)}] Sky Framework`, '-v, --version')
  // .option('-a, --aaa-bbb', 'commander.aaaBbb')
  .command('init [path]')
  .alias('i')
  .description('Init Sky framework')
  .action(function (env, options) {
    console.log('do init')
  })
  .command('dbscan -c config.json')
  .description('scan DB')
  .action(function (env, options) {
    console.log('scan DB')
  })

commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
