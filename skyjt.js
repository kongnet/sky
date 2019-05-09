#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
let Pack = require('./package.json')
let path = require('path')
let tools = $.requireAll(path.join(__dirname, '.', 'lib'))
// 输出字符键盘
function keyboard () {
  console.log((_ => [..."`1234567890-=~~QWERTYUIOP[]\\~ASDFGHJKL;'~~ZXCVBNM,./~"].map(x => (o += `/${b = '_'.repeat(w = x < y ? 2 : ' 667699'[x = ['BS', 'TAB', 'CAPS', 'ENTER'][p++] || 'SHIFT', p])}\\|`, m += y + (x + '    ').slice(0, w) + y + y, n += y + b + y + y, l += ' __' + b)[73] && (k.push(l, m, n, o), l = '', m = n = o = y), m = n = o = y = '|', p = l = k = []) && k.join`
`)())
}
commander
  .usage('[command] [options] <file ...>')
  .version(`[${$.c.g(Pack.version)}] Sky Framework`, '-v, --version')
// .option('-a, --aaa-bbb', 'commander.aaaBbb')
commander.command('init [option]')
  .alias('i')
  .description($.c.g('Init') + ' Sky Framework')
  .option('-c, --create <name>', 'defaults to ./output')
  .option('-f, --force', 'cover dir')
  .action(function (option, name) {
    // console.log(name.force)
    let spinner = new $.Spinner()
    spinner.start('Project Init...')
    tools.init.index.init(name.create ? name.create : 'output', name.force)
    setTimeout(function () {
      spinner.stop()
      console.log('Init Done.')
      process.exit(0)
    }, 2000)
  })
commander.command('dbscan [option]')
  .alias('db')
  .description('scan ' + $.c.g('Mysql JiaTui rules') + ' Default: 127.0.0.1/root/123456')
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
  .alias('comment')
  .description('scan ' + $.c.g('Function Comment JiaTui rules.'))
  .option('-c, --config <path>', 'defaults to ./commentConf.js')
  .action(async function (option, p) {
    let spinner = new $.Spinner()
    spinner.start('Scan files...')

    const childProcess = require('child_process')
    const worker = childProcess.fork(path.join(__dirname, '/worker_commentscan.js'))
    worker.on('message', m => {
      // $.log(m)
      if (m.type === 'end') {
        spinner.stop()
        if (!m.totalErr) {
          console.log($.c.g('=== Your are Master of Notes! ==='))
        }
      }
      if (m.type === 'scanning') {
        spinner.setShowTxt(m.msg)
      }
    })
    // tools.commentscan.index(p.config)
  })
commander.command('swaggerscan [option]')
  .alias('swagger')
  .description('scan ' + $.c.g('Swagger JiaTui rules'))
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(async function (option, path) {
    // $.log('swagger', path.config)
    let spinner = new $.Spinner()
    spinner.start('Swagger scan...')
    let r
    if (path.config) {
      r = await tools.swaggerscan.index.scan(path.config)
    } else {
      r = await tools.swaggerscan.index.scan()
    }
    setTimeout(function () {
      spinner.stop()
      $.dir(r)
      console.log('Scan Done.')
      process.exit(0)
    }, 2000)
  })
commander.command('history')
  .description('today history ')
  .action(function (option, path) {
    tools.todayhistory.index.scan()
  })
commander.command('fun')
  .description('fun output')
  .action(function (option, path) {
    keyboard()
  })
commander.command('get')
  .description(`${$.c.g('Get')} url`)
  .option('-p, --param [param]', '')
  .option('-h, --host <param>', '')
  .action(function (option, path) {
    if (option.host && (option.host.includes('http://') || option.host.includes('https://'))) {
      option.method = 'get'
      tools.curl.index.scan(option)
    }
  })
commander.command('post')
  .description(`${$.c.g('Post')} url`)
  .option('-p, --param [param]', '')
  .option('-h, --host <param>', '')
  .action(function (option, path) {
    if (option.host && (option.host.includes('http://') || option.host.includes('https://'))) {
      option.method = 'post'
      tools.curl.index.scan(option)
    }
  })
commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
/*
let spinner = new $.Spinner('dots7')
spinner.start()

var out = process.stdout
var numOfLinesToClear = 0
out.write('1\n') // prints `1` and new line
++numOfLinesToClear
out.write('2\n')
++numOfLinesToClear
process.stdout.moveCursor(0, -numOfLinesToClear) // move the cursor to first line
setInterval(function () {
  process.stdout.clearLine()
  out.cursorTo(0) // moves the cursor at the beginning of line
  out.write(`${3 + index}\n`) // prints `3`
  out.write(`${4 + index}\n`) // prints new line and `4`
  process.stdout.moveCursor(0, -numOfLinesToClear)
  index++
}, 1000)
*/
