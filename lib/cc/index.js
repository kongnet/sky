/* global $ */
const { execSync } = require('child_process')
const fs = require('fs')
const ccjt = require('cc-jt')
const path = require('path')
// let os = process.platform

// 统计git commit and lines percent
let timeout = 2400000
// 统计主函数
function installCcjt() {
  try {
    console.log(
      $.c.y('1.安装JT JS圈复杂度检测 扩展插件 需要一些时间，请耐心等候...')
    )
    // execSync('npm i babel-eslint eslint-plugin-html eslint-plugin-vue --save-dev --registry=https://registry.npm.taobao.org/', { timeout: timeout })
    // execSync('npm i cc-jt --save --registry=https://registry.npm.taobao.org/', { timeout: timeout })
    console.log('2.生成.eslintignore, 忽略要扫描请在此文件中配置')
    let isEslintIgnore = fs.existsSync(
      path.join(process.cwd(), '.eslintignore')
    )
    let isGitIgnore = fs.existsSync(path.join(process.cwd(), '.gitignore'))
    let eslintFile = isEslintIgnore
      ? fs.readFileSync(path.join(process.cwd(), '.eslintignore')).toString()
      : ''
    let gitFile = isGitIgnore
      ? fs.readFileSync(path.join(process.cwd(), '.gitignore')).toString()
      : ''
    let outputFileAry = [eslintFile.split('\n'), gitFile.split('\n')]
      .flatten()
      .unique()
      .filter(Boolean)
    fs.writeFileSync(
      '.eslintignore',
      'out\ntest\ntests\nnode_modules\ncoverage\njtFrontCheck.html\njtFrontEasyCheck.html\n' +
      outputFileAry.join('\n')
    )
    console.log($.c.y('.eslintignore + .gitignore 合并。完成JT CC初始化!'))
  } catch (e) {
    $.err(e.toString())
  }
}

function runCcjt(isShowAll) {
  console.log('运行JT JS圈复杂度检测，请耐心等候...')
  try {
    /* let exeStr = os.includes('win32') ?
    `eslint -c .\\node_modules\\cc-jt\\cc-jt.js . --no-color --ignore-path .\\.eslintignore`
    : `eslint -c ./node_modules/cc-jt/cc-jt.js . --no-color --ignore-path ./.eslintignore`
    r = exec(exeStr, function (err, ...x) {
      if (err) {
        console.log(x)
      }
    })
    return */

    // NOTICE :这里使用异步函数，因为会返回exit非0 命令执行失败的情况

    let t = Date.now()
    let funcTypeObj = {
      Unknown: '未知 *',
      Method: '方法',
      'Async function': '异步async',
      'Arrow function': '箭头=>',
      Function: '普通'
    }
    let useCaseTotal = 0
    let groupCount = [0, 0, 0] // 复杂度分组统计
    const cwd = process.cwd()
    let funcAdvice
    let resultAry = []
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = ccjt.cc
    jtRule.rules.complexity = ['warn', { max: 1 }]
    jtRule.resolvePluginsRelativeTo = path.join(__dirname, '../../node_modules')
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])

    report.results.forEach(item => {
      const filePath = item.filePath.replace(cwd, '').trim()
      let message = item.messages.map(it => {
        if (it.ruleId === 'complexity') {
          let msg
          let isRefactor = 1 // 是否重构
          msg = it.message
            .replace('Maximum allowed is 1.', '')
            .replace('has a complexity of ', '')
            ; /(\d+)\./g.test(msg)
          let funcCc = +RegExp.$1
          if (funcCc < 11) {
            funcAdvice = $.c.g('无需')
            useCaseTotal += funcCc
            groupCount[0]++
            isRefactor = 0
          }
          if (funcCc >= 11 && funcCc < 16) {
            funcAdvice = $.c.y('建议')
            useCaseTotal += funcCc
            groupCount[1]++
          }
          if (funcCc >= 16) {
            funcAdvice = $.c.r('立刻')
            useCaseTotal += funcCc
            groupCount[2]++
          }
          let hasFuncName = /'([a-zA-Z0-9_$]+)'/g.test(msg)
          let funcName = hasFuncName ? RegExp.$1 : '*'
          // console.log('func', , ccAry[i])
          let hasFuncType = /^(Method |Async function |Arrow function |Function )/g.test(
            msg
          )
          let funcType =
            funcTypeObj[(hasFuncType ? RegExp.$1 : 'Unknown').trim()]
          // if (!isRefactor && !isShowAll) { return null }
          if (isRefactor || isShowAll) {
            return {
              重构: funcAdvice,
              复杂度: funcCc,
              文件名: filePath + ':' + it.line + ':' + it.column,
              函数名称: funcName === '*' ? '匿名' : funcName,
              类型: funcType
            }
          } else {
            return null
          }
        }
      })
      resultAry.push(message)
    })
    let result = resultAry.flatten().filter(Boolean)
    if (result.length === 0) {
      console.log($.c.c('您的项目没有任何问题，厉害'))

      return
    }
    $.drawTable(result, [6, 6, 85, 30, 9])
    console.log(
      `本系统无需重构 ${$.c.g(groupCount[0] || '0')} 个, 建议重构 ${$.c.y(
        groupCount[1] || '0'
      )} 个, 必须重构 ${$.c.r(groupCount[2] || '0')} 个, 一共 ${$.math.sum(
        groupCount
      ) || '0'} 个函数.`
    )
    console.log(`本系统至少需要 ${$.c.y(useCaseTotal)} 个测试用例进行覆盖.`)
    console.log('本次扫描耗时', Date.now() - t, 'ms')
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有任何问题，厉害'))
    } else {
      console.log($.c.y('请尝试运行 skyjt ccjt, 具体错误如下:'))
      console.log(e.stack)
    }
  }
}
// eslint json格式的处理函数
function eslintJson(o) {
  const len = o.length
  const fileErrCount = { correct: 0, incorrect: 0 }
  const errType = {}
  const errLev = {}
  const outputAry = []
  o.forEach(it => {
    if (it.errorCount + it.warningCount) {
      fileErrCount.incorrect++
    }
    if (it.messages.length > 0) {
      it.messages.forEach(msgIt => {
        errType[msgIt.ruleId] = errType[msgIt.ruleId]
          ? errType[msgIt.ruleId] + 1
          : 1
        errLev[msgIt.ruleId] = msgIt.severity - 1 // 转换成0和1
      })
    }
  })
  for (let i in errType) {
    outputAry.push({ name: errLev[i] ? $.c.r(i) : $.c.y(i), count: errType[i] })
  }
  $.drawTable(outputAry.orderBy(['count'], ['desc']), [30, 6])
  console.log($.c.m('https://eslint.org/docs/rules/'), '查看错误规则说明')
  return `总共扫描文件：${len}, 有问题文件：${fileErrCount.incorrect}`
}
function runJtFrontCheck(isFixing = false, isStat = false) {
  try {
    let t = Date.now()
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = ccjt.ccc
    console.log(
      '运行JT 前端检测，请耐心等候... jt强制规则',
      ccjt.jtStat.errorCount,
      'jt警告规则',
      ccjt.jtStat.warnCount
    )
    jtRule.resolvePluginsRelativeTo = path.join(__dirname, '../../node_modules')
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    jtRule.extensions = ['.js', '.html', '.htm', '.vue']
    jtRule.fix = isFixing
    const cli = new CLIEngine(jtRule)

    const report = cli.executeOnFiles(['.'])
    const formatHtml = cli.getFormatter(
      path.join(
        __dirname,
        '../../node_modules',
        'eslint-formatter-html-extended'
      )
    )
    const formatDefault = cli.getFormatter(isStat ? 'json' : '')
    CLIEngine.outputFixes(report)
    console.log(
      isStat ? eslintJson(report.results) : formatDefault(report.results)
    )
    // fs.writeFileSync('jtFrontCheck.html', formatHtml(report.results))
    console.log(
      $.c.y('jtFrontCheck.html 成功生成!'),
      '本次扫描耗时',
      Date.now() - t,
      'ms'
    )
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有任何问题，厉害'))
    } else {
      console.log(e.stack)
      console.log($.c.y('请尝试运行 skyjt ccjt '))
    }
  }
}
function runJtFrontEasyCheck() {
  try {
    let t = Date.now()
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = ccjt.cc

    jtRule.rules['max-len'] = [1, 180]
    jtRule.rules['max-lines'] = [1, { skipComments: true, max: 555 }]
    jtRule.rules['max-params'] = [1, 7]
    jtRule.rules['max-statements'] = [
      1,
      { max: 100 },
      { ignoreTopLevelFunctions: true }
    ]
    jtRule.rules['max-lines-per-function'] = [1, 100]

    console.log(
      '运行JT 前端规模简易检测，请耐心等候... jt强制规则',
      ccjt.jtStat.errorCount,
      'jt警告规则',
      ccjt.jtStat.warnCount
    )
    jtRule.resolvePluginsRelativeTo = path.join(__dirname, '../../node_modules')
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    jtRule.extensions = ['.js', '.html', '.htm', '.vue']

    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])
    const formatHtml = cli.getFormatter(
      path.join(
        __dirname,
        '../../node_modules',
        'eslint-formatter-html-extended'
      )
    )
    const formatDefault = cli.getFormatter('')
    CLIEngine.outputFixes(report)
    console.log(formatDefault(report.results))
    fs.writeFileSync('jtFrontEasyCheck.html', formatHtml(report.results))
    console.log(
      $.c.y('jtFrontEasyCheck.html 成功生成!'),
      '本次扫描耗时',
      Date.now() - t,
      'ms'
    )
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有任何问题，厉害'))
    } else {
      console.log(e.stack)
      console.log($.c.y('请尝试运行 skyjt ccjt '))
    }
  }
}
function listTodoLabel() {
  try {
    let t = Date.now()
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = ccjt.cc
    const todoLabel = ['todo', 'fixme', 'xxx', 'hack', 'notice']
    const labelAry = []
    jtRule.rules['no-warning-comments'] = [
      1,
      { terms: todoLabel, location: 'anywhere' }
    ]

    jtRule.resolvePluginsRelativeTo = path.join(__dirname, '../../node_modules')
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    jtRule.extensions = ['.js', '.html', '.htm', '.vue']

    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])
    // const formatDefault = cli.getFormatter('')
    report.results.forEach(it => {
      let sourceAry = (it.source || '').split('\n')
      it.messages.forEach(msgIt => {
        /'([a-zA-Z0-9_ ]+)'/g.test(msgIt.message)
        // console.log(it.filePath.replace(process.cwd(), '') + ':' + msgIt.line + ':' + msgIt.column, $.c.y(RegExp.$1), sourceAry[msgIt.line - 1].replace('\r', ''))
        labelAry.push({
          文件:
            it.filePath.replace(process.cwd(), '') +
            ':' +
            msgIt.line +
            ':' +
            msgIt.column,
          标记: RegExp.$1,
          内容: sourceAry[msgIt.line - 1].replace('\r', '').trim('')
        })
      })
    })
    $.drawTable(labelAry, [40, 10, 150])
    // console.log(formatDefault(report.results))
    console.log('本次扫描耗时', Date.now() - t, 'ms')
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有TODO类标记'))
    } else {
      console.log(e.stack)
      console.log($.c.y('请尝试运行 skyjt ccjt '))
    }
  }
}

const checkIdentifier = function checkIdentifier(s) {
  let re1 = /^[a-z]+\d*$/g
  let re2 = /^[A-Z]+\d*$/g
  let re3 = /^[A-Z]+[A-Z_]*[A-Z0-9]*[^_]$/g
  let re4 = /^[_\$]{1,2}[a-z]*[A-Z\d]*$/g
  let re6 = /^[a-zA-Z][a-zA-Z\d]((?!_).)*$/g
  // let re7 = /^(s|str|d|date|n|f|b|is|a|arr|o|obj|fn|r|re|g){1}[A-Z]+[a-zA-Z\d]*((?!_).)*$/g
  // let re8 = /^[a-z]+[a-zA-Z\d]*(Str|Date|Num|Fn|Fun|Func|Obj|Object|Reg|Msg|Text|Txt|Name|Url|Arr|Ary){1}((?!_).)*$/g
  return re1.test(s) || re2.test(s) || re3.test(s) || re4.test(s) || re6.test(s) // || re7.test(s)|| re8.test(s)
}
function checkVariable() {
  try {
    let t = Date.now()
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = ccjt.cc
    const labelAry = []
    jtRule.rules['id-match'] = [
      1,
      '[!]+',
      { onlyDeclarations: true, properties: false }
    ]

    jtRule.resolvePluginsRelativeTo = path.join(__dirname, '../../node_modules')
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    jtRule.extensions = ['.js', '.html', '.htm', '.vue']

    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])
    let nCount = 0
    let aVariable = []
    // const formatDefault = cli.getFormatter('')
    report.results.forEach(it => {
      it.messages.forEach(msgIt => {
        /'([a-zA-Z0-9_\$ ]+)'/g.test(msgIt.message)
        let sVarName = RegExp.$1
        if (!checkIdentifier(sVarName) && sVarName.length > 0) {
          nCount++
          aVariable.push(sVarName)
          labelAry.push({
            序号: nCount,
            文件:
              it.filePath.replace(process.cwd(), '') +
              ':' +
              msgIt.line +
              ':' +
              msgIt.column,
            可能会误解的变量名: sVarName
          })
        }
      })
    })
    if (labelAry.length === 0) {
      throw 'No files matching'
    }
    $.drawTable(labelAry, [10, 100, 40])

    let oVarCount = aVariable.count()
    let aVarCount = []
    nCount = 0
    for (let i in oVarCount) {
      nCount++
      aVarCount.push({ name: i, value: oVarCount[i] })
    }
    $.drawTable(aVarCount.orderBy(['value'], ['desc']) || [], [40, 10])
    console.log('不同的变量数为：', nCount)

    // console.log(formatDefault(report.results))
    console.log('本次扫描耗时', Date.now() - t, 'ms')
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有变量命名问题'))
    } else {
      console.log(e.stack)
      console.log($.c.y('请尝试运行 skyjt ccjt '))
    }
  }
}
module.exports = {
  checkVariable: checkVariable,
  install: installCcjt,
  listTodoLabel: listTodoLabel,
  runJtFrontCheck: runJtFrontCheck,
  runJtFrontEasyCheck: runJtFrontEasyCheck,
  scan: runCcjt
}
