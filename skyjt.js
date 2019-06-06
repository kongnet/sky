#!/usr/bin/env node
let commander = require('commander')
let $ = require('meeko')
let Pack = require('./package.json')
let path = require('path')
const req = require('request-promise-native')
// 版本号检测
async function checkVersion () {
  let r = await req({
    method: 'get',
    uri: 'https://raw.githubusercontent.com/kongnet/sky/master/package.json',
    timeout: 2000
  })
  let verLocal = Pack.version.split('.')
  let s1 = verLocal.reduce((x, y, idx) => (+x) * (10 ** (4 - idx)) + (+y) * (10 ** (3 - idx)))
  let ver = JSON.parse(r.replaceAll('\n', '')).version.split('.')
  let s2 = ver.reduce((x, y, idx) => (+x) * (10 ** (4 - idx)) + (+y) * (10 ** (3 - idx)))
  if (s2 > s1) {
    console.log('新版本发现', verLocal.join('.'), '=>', $.c.m(ver.join('.')), $.c.c(' npm i -g skyjt '))
  }
}
checkVersion()
let tools = $.requireAll(path.join(__dirname, '.', 'lib'))
let spinnerHandler = {}
// 输出字符键盘
function keyboard () {
  console.log((_ => [..."`1234567890-=~~QWERTYUIOP[]\\~ASDFGHJKL;'~~ZXCVBNM,./~"].map(x => (o += `/${b = '_'.repeat(w = x < y ? 2 : ' 667699'[x = ['BS', 'TAB', 'CAPS', 'ENTER'][p++] || 'SHIFT', p])}\\|`, m += y + (x + '    ').slice(0, w) + y + y, n += y + b + y + y, l += ' __' + b)[73] && (k.push(l, m, n, o), l = '', m = n = o = y), m = n = o = y = '|', p = l = k = []) && k.join`
`)())
}
commander
  .usage('[command] [options] <file ...>')
  .version(`[${$.c.g(Pack.version)}] Sky Framework`, '-v, --version')
// .option('-a, --aaa-bbb', 'commander.aaaBbb')
// .option('-mp, --mp', 'cheat miniProgram')

commander.command('init [option]')
  .alias('i')
  .description($.c.g('Init') + ' Sky Framework or .js like skyFrameworkConfig.js')
  .option('-n, --name <name>', 'defaults to ./output')
  .option('-c, --config <file>', 'read config path from .js, defalut to ./output')
  .option('-t, --template <templatename>', 'sky|mp| ...')
  .option('-f, --force', 'force cover dir')
  .action(async function (option, name) {
    let r = {}
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Project Init...')
    let projectName = 'output'
    if (typeof name.name === 'string') projectName = name.name
    if (name.config) {
      const setting = require(path.join(__dirname, name.config))
      r = await tools.init.index.init(name.name ? projectName : 'output', name.force, name.template, setting)
      // tools.init.index.initByConfig(projectName, setting, name.force)
    } else {
      r = await tools.init.index.init(name.name ? projectName : 'output', name.force, name.template)
    }
    // tools.init.index.init(name.create ? name.create : 'output', name.force)
    setTimeout(function () {
      spinnerHandler.stop()
      if (r.templateName) {
        console.log(`${r.templateName} [${r.ver}] Init Done.`)
      }
      process.exit(0)
    }, 2000)
  })
commander.command('dbscan [option]')
  .alias('db')
  .description('scan ' + $.c.g('Mysql JiaTui rules') + ' Default: 127.0.0.1/root/123456')
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(function (option, p) {
    // console.log(option, p.config)
    if (p.config) {
      tools.dbscan.index.scan(p.config)
    } else {
      tools.dbscan.index.scan()
    }
  })
commander.command('gitstat')
  .description('Statistics git author commits and lines')
  .action(function (option, p) {
    tools.gitstat.index.scan()
  })
commander.command('commentscan [option]')
  .alias('comment')
  .description('scan ' + $.c.g('Function Comment JiaTui rules.'))
  .option('-c, --config <path>', 'defaults to ./commentConf.js')
  .action(async function (option, p) {
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Scan files...')

    const childProcess = require('child_process')
    const worker = childProcess.fork(path.join(__dirname, '/worker_commentscan.js'))
    worker.on('message', m => {
      // $.log(m)
      if (m.type === 'end') {
        spinnerHandler.stop()
        if (!m.totalErr) {
          console.log($.c.g('=== Your are Master of Notes! ==='))
        }
      }
      if (m.type === 'scanning') {
        spinnerHandler.setShowTxt(m.msg)
      }
    })
    // tools.commentscan.index(p.config)
  })
commander.command('swaggerscan [option]')
  .alias('swagger')
  .description('scan ' + $.c.g('Swagger JiaTui rules'))
  .option('-c, --config <path>', 'defaults to ./config.js')
  .action(async function (option, p) {
    // $.log('swagger', path.config)
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Swagger scan...')
    let r
    if (p.config) {
      r = await tools.swaggerscan.index.scan(p.config)
    } else {
      r = await tools.swaggerscan.index.scan()
    }
    setTimeout(function () {
      spinnerHandler.stop()
      $.dir(r)
      console.log('Scan Done.')
      process.exit(0)
    }, 2000)
  })
commander.command('wttr')
  .description('weather output -c [city]')
  .option('-c, --city [city]', 'defaults local')
  .action(async function (option, p) {
    // $.log(option.city)
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Downloading...')
    let r = await tools.curl.index.wttr(option.city)
    spinnerHandler.stop()
    process.stdout.write(r)
  })
commander.command('coin')
  .description('cryptocurrencies exchange rates -c [coin name]')
  .option('-c, --coin [name]', 'defaults top 10')
  .action(async function (option, p) {
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Downloading...')
    let r = await tools.curl.index.coin(option.coin)
    spinnerHandler.stop()
    process.stdout.write(r)
  })
commander.command('history')
  .description('today history ')
  .action(function (option, p) {
    tools.todayhistory.index.scan()
  })
commander.command('fun')
  .description('fun output')
  .action(function (option, p) {
    keyboard()
  })
commander.command('get')
  .description(`${$.c.g('Get')} -h url -p param`)
  .option('-p, --param [param]', '')
  .option('-h, --host <param>', '')
  .action(function (option, p) {
    if (option.host && (option.host.includes('http://') || option.host.includes('https://'))) {
      option.method = 'get'
      tools.curl.index.scan(option)
    }
  })
commander.command('post')
  .description(`${$.c.g('Post')} -h url -p param`)
  .option('-p, --param [param]', '')
  .option('-h, --host <param>', '')
  .action(function (option, p) {
    if (option.host && (option.host.includes('http://') || option.host.includes('https://'))) {
      option.method = 'post'
      tools.curl.index.scan(option)
    }
  })
commander.parse(process.argv)

if (process.argv.length === 2) {
  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
let errStackFn = e => {
  if (spinnerHandler.stop) spinnerHandler.stop()
  let str = e.toString()
  if (!str.includes('TIMEDOUT')) {
    $.err(e.toString())
  }
}
process.on('uncaughtException', errStackFn)
process.on('unhandledRejection', errStackFn)
/*
spinnerHandler = new $.Spinner('dots2')
spinnerHandler.start()
*/
