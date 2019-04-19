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
  .description('Init Sky Framework')
  .action(function (env, options) {
    console.log('do init')
  })
commander.command('dbscan [option]')
  .alias('db')
  .description($.c.g('scan Mysql JiaTui rules'))
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(function (option, path) {
    // console.log(option, path.config)
    if (path.config) {
      tools.dbscan.index.scan(path.config)
    } else {
      tools.dbscan.index.scan()
    }
  })
commander.command('commentscan [option]')
  .description('scan Function Comment')
  .option('-c, --config <path>', 'defaults to ./commentscan.json')
  .action(function (option, path) {
    console.log(option, path.config)
  })
commander.command('swaggerscan [option]')
  .alias('swagger')
  .description($.c.g('scan Swagger JiaTui rules'))
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(function (option, path) {
    if (path.config) {
      try {
        if (path.config.indexOf('http://') !== -1 || path.config.indexOf('https://') !== -1) {
          tools.swaggerscan.index.scan(path.config)
        } else {
          $.err('Config url error！')
        }
      } catch (e) {
        $.err(e ? 'Config format error！' : 'Config file missing!')
        process.exit()
      }
    } else {
      tools.swaggerscan.index.scan()
    }
  })
commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
