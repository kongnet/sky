#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
commander
  .usage('[options] ')
  .version(`${$.c.g('0.8.0')} Sky Framework`, '-v, --version')
  // .option('-a, --aaa-bbb', 'commander.aaaBbb')

  .command('init [path]')
  .alias('i')
  .description('Init Sky framework')
  .action(function (env, options) {
    console.log('do init')
  })

commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`Init Sky framework: ${$.c.y('sky init')}`)
}
