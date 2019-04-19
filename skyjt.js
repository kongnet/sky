#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
let Pack = require('./package.json')
commander
  .usage('[command] [options] <file ...>')
  .version(`[${$.c.g(Pack.version)}] Sky Framework`, '-v, --version')
  // .option('-a, --aaa-bbb', 'commander.aaaBbb')
commander.command('init')
  .alias('i')
  .description('Init Sky framework')
  .action(function (env, options) {
    console.log('do init')
  })
commander.command('dbscan [option]')
  .description('scan DB')
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(function (option, path) {
    console.log(option, path.config)
  })

commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
