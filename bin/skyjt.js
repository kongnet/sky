#!/usr/bin/env node
// global.Promise = require('bluebird')
let $ = require('meeko')
global.$ = $
let commander = require('commander')
let Pack = require('../package.json')
let path = require('path')
let tools = $.requireAll(path.join(__dirname, '..', 'lib'))
let spinnerHandler = {}
const childProcess = require('child_process')

childProcess.fork(path.join(__dirname, 'check_version.js'))

// 输出字符键盘1
function keyboard () {
  /*eslint-disable */
  console.log((_ => [..."`1234567890-=~~QWERTYUIOP[]\\~ASDFGHJKL;'~~ZXCVBNM,./~"].map(x => (o += `/${b = '_'.repeat(w = x < y ? 2 : ' 667699'[x = ['BS', 'TAB', 'CAPS', 'ENTER'][p++] || 'SHIFT', p])}\\|`, m += y + (x + '    ').slice(0, w) + y + y, n += y + b + y + y, l += ' __' + b)[73] && (k.push(l, m, n, o), l = '', m = n = o = y), m = n = o = y = '|', p = l = k = []) && k.join`
`)())
/*eslint-ensable */
}
commander
  .usage('[command] [options] <file ...>')
  .version(`[${$.c.g(Pack.version)}] Sky Framework`, '-v, --version')
// .option('-a, --aaa-bbb', 'commander.aaaBbb')
// .option('-mp, --mp', 'cheat miniProgram')

commander.command('init [option]')
  .alias('i')
  .description($.c.g('Init') + ' Sky Framework or .js like skyFrameworkConfig.js')
  .option('-c, --config <file>', 'read config path from .js, defalut to ./output')
  .option('-t, --template <templatename>', 'sky|mp| ...')
  .option('-f, --force', 'force cover dir')
  .action(async function (option, cfg) {
    let r = {}
    if (cfg.config) {
      const setting = require(path.join(__dirname, cfg.config))
      r = await tools.init.index.init(cfg, setting)
      // tools.init.index.initByConfig(projectName, setting, name.force)
    } else {
      r = await tools.init.index.init(cfg)
    }

    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Project Init...')
    setTimeout(function () {
      spinnerHandler.stop()
      if (r.templateName) {
        console.log(`${r.templateName} [${r.ver}] Init Done.`)
      }
      process.exit(0)
    }, 1000)
  })
commander.command('lint [option]')
  .alias('l')
  .description('create/cover ' + $.c.g('Lint') + ' config in project root path')
  .option('-t, --template <template>', 'vue|weex|mp|react ...')
  .option('-f, --force', 'force cover file')
  .action(async function (option, name) {
    let r = {}
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Loading...')
    let projectName = 'output'
    if (name.config) {
      const setting = require(path.join(__dirname, name.config))
      r = await tools.lint.index.generate(projectName, name.force, name.template, setting)
    } else {
      r = await tools.lint.index.generate(projectName, name.force, name.template)
    }
    setTimeout(function () {
      spinnerHandler.stop()
      if (r.templateName) {
        console.log(`${r.templateName} [${r.ver}] Generate Done.`)
      }
      process.exit(0)
    }, 2000)
  })
commander.command('czjt')
  .description(`Install ${$.c.g('Jiatui commitizen')}`)
  .action(function (option, path) {
    tools.czjt.index.install()
  })
commander.command('ccjt')
  .description(`Install ${$.c.g('Jiatui Cyclomatic complexity install')}`)
  .action(function (option, path) {
    tools.cc.index.install()
  })
commander.command('cc')
  .description(`Scan ${$.c.g('JS Cyclomatic complexity')}`)
  .option('-a, --all', 'show all function and method...')
  .action(function (option, path) {
    tools.cc.index.scan(option.all)
  })
commander.command('ecc')
  .description(`Scan ${$.c.g('JS Front Dimensions Check.')}`)
  .action(function (option, path) {
    tools.cc.index.runJtFrontEasyCheck()
  })
commander.command('ccc')
  .description(`Scan ${$.c.g('JS Front Check.')}`)
  .option('-f, --fix', 'fix problem...')
  .action(function (option, path) {
    tools.cc.index.runJtFrontCheck(option.fix)
  })
commander.command('answer')
  .description('Answer your question!')
  .action(function (option, path) {
    tools.answer.index.answer()
  })
commander.command('jtjs [option]')
  .alias('jt')
  .description(`Init ${$.c.g('JiatuiCommonJS')}`)
  .option('-c, --config <path>', 'defaults to ./jt.js')
  .action(function (option, path) {
    if (path.config) {
      tools.jtjs.index.writeFile(path.config)
    } else {
      tools.jtjs.index.writeFile('')
    }
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
commander.command('capi')
  .description('create front Api files automatically')
  .option('-c, --config <path>', 'defaults to ./capiConf.js')
  .action(function () {
    tools.capi.index.main()
  })
commander.command('commentscan [option]')
  .alias('comment')
  .description('scan ' + $.c.g('Function Comment JiaTui rules.'))
  .option('-c, --config <path>', 'defaults to ./commentConf.js')
  .action(async function (option, p) {
    spinnerHandler = new $.Spinner()
    spinnerHandler.start('Scan files...')

    const worker = childProcess.fork(path.join(__dirname, 'worker_commentscan.js'))
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
  commander.command('dict')
  .description(`en-cn ${$.c.g('Dict')}. skyjt dict [word]`)
  .action(async function (...p) {
    if($.tools.isString(p[0])) {
    let r = await tools.curl.index.dict(p[0])
    //process.stdout.write(r)
    }
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
  const CFonts = require('cfonts')

  CFonts.say('SKYJT', {
    font: 'chrome',
    align: 'left',
    colors: ['#0ff', 'green', '#ff0'],
    space: false
  })

  console.log(`[${$.c.g(Pack.version)}] Sky framework: ${$.c.y('sky init')}`)
}
let errStackFn = e => {
  if (spinnerHandler.stop) { spinnerHandler.stop() }
  let str = e.toString()
  if (!str.includes('TIMEDOUT') && !str.includes('ENOTFOUND')) {
    $.err(e.toString())
  }
}
process.on('uncaughtException', errStackFn)
process.on('unhandledRejection', errStackFn)

/*
spinnerHandler = new $.Spinner('dots2')
spinnerHandler.start()
*/
