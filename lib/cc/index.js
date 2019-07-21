/* global $ */
const { execSync } = require('child_process')
const fs = require('fs')
// let os = process.platform

// 统计git commit and lines percent
let timeout = 2400000
// 统计主函数
function installCcjt () {
  try {
    /* console.log('1.安装JT JS圈复杂度检测 主插件 需要一些时间，请耐心等候...')
    execSync(`cnpm i eslint --save-dev`, { timeout: timeout })
    console.log('2.安装JT JS圈复杂度检测 扩展插件 需要一些时间，请耐心等候...')
    execSync(`cnpm i babel-eslint eslint-plugin-html eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard --save-dev`, { timeout: timeout })
    console.log('3.安装JT JS圈复杂度 规则插件 需要一些时间，请耐心等候...')
    execSync(`cnpm i cc-jt --save-dev`, { timeout: timeout })
    */

    console.log($.c.y('1.安装JT JS圈复杂度检测 扩展插件 需要一些时间，请耐心等候...'))
    execSync('cnpm i babel-eslint eslint-plugin-html eslint-plugin-vue --save-dev', { timeout: timeout })
    console.log('2.生成.eslintignore, 忽略要扫描请在此文件中配置')
    fs.writeFileSync('.eslintignore', 'out\ntest\ntests\nnode_modules\ncoverage\njtFrontCheck.html\n')
    console.log($.c.y('完成JT CC初始化!'))
  } catch (e) {
    $.err(e.toString())
  }
}

function runCcjt (isShowAll) {
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
      'Unknown': '未知 *',
      'Method': '方法',
      'Async function': '异步async',
      'Arrow function': '箭头=>',
      'Function': '普通'
    }
    let useCaseTotal = 0
    let groupCount = [0, 0, 0]// 复杂度分组统计
    const cwd = process.cwd()
    let funcAdvice
    let resultAry = []
    const CLIEngine = require('eslint').CLIEngine
    const jtRule = require('cc-jt/cc-jt.js')
    jtRule.rules['complexity'] = [
      'warn',
      { max: 1 }
    ]
    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])

    report.results.forEach(item => {
      const filePath = item.filePath.replace(cwd, '').trim()
      let message = item.messages.map(it => {
        if (it.ruleId === 'complexity') {
          let msg
          let isRefactor = 1 // 是否重构
          msg = it.message.replace('Maximum allowed is 1.', '').replace('has a complexity of ', '')
          ;(/(\d+)\./g).test(msg)
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
          let hasFuncType = /^(Method |Async function |Arrow function |Function )/g.test(msg)
          let funcType = funcTypeObj[(hasFuncType ? RegExp.$1 : 'Unknown').trim()]
          // if (!isRefactor && !isShowAll) { return null }
          if (isRefactor || isShowAll) {
            return {
              '重构': funcAdvice,
              '复杂度': funcCc,
              '文件名': filePath + ':' + it.line + ':' + it.column,
              '函数名称': funcName === '*' ? '匿名' : funcName,
              '类型': funcType
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
    $.drawTable(result, [4, 6, 85, 30, 9])
    console.log(`本系统无需重构 ${$.c.g(groupCount[0] || '0')} 个, 建议重构 ${$.c.y(groupCount[1] || '0')} 个, 必须重构 ${$.c.r(groupCount[2] || '0')} 个, 一共 ${$.math.sum(groupCount) || '0'} 个函数.`)
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
function runJtFrontCheck (isFixing = false) {
  console.log('运行JT 前端检测，请耐心等候...')
  try {
    let t = Date.now()

    const CLIEngine = require('eslint').CLIEngine
    const jtRule = require('cc-jt/jt-eslint.js')

    jtRule.useEslintrc = false // 忽略 .eslintrc文件
    jtRule.extensions = ['.js', '.html', '.htm', '.vue']
    jtRule.fix = isFixing
    const cli = new CLIEngine(jtRule)
    const report = cli.executeOnFiles(['.'])
    const formatHtml = cli.getFormatter('html')
    const formatDefault = cli.getFormatter()
    console.log(formatDefault(report.results))
    fs.writeFileSync('jtFrontCheck.html', formatHtml(report.results))
    console.log('jtFrontCheck.html 成功生成!', '本次扫描耗时', Date.now() - t, 'ms')
  } catch (e) {
    if (e.toString().includes('No files matching')) {
      console.log($.c.c('您的项目没有任何问题，厉害'))
    } else {
      console.log(e.stack)
      console.log($.c.y('请尝试运行 skyjt ccjt '))
    }
  }
}
module.exports = {
  install: installCcjt,
  scan: runCcjt,
  runJtFrontCheck: runJtFrontCheck
}
