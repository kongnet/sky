#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
let Pack = require('./package.json')
let path = require('path')
let tools = $.requireAll(path.join(__dirname, '.', 'lib'))

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
  .option('-c, --config <path>', 'defaults to ./dbscan.json')
  .action(function (option, path) {
    // console.log(option, path.config)
    if (path.config) {
      tools.dbscan.index.scan(path.config)
    } else {
      tools.dbscan.index.scan()
    }
  })
commander.command('commentscan [option]')
  .description('scan Comment')
  .option('-c, --config <path>', 'defaults to ./commentscan.json')
  .action(function (option, path) {
    console.log(option, path.config)
  })
commander.command('swaggerscan [option]')
  .description('scan Swagger')
  .option('-c, --config <path>', 'defaults to ./swagger.json')
  .action(function (option, path) {
    console.log(option, path.config)
  })
commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
