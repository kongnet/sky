/* global $ */
const { execSync } = require('child_process')
const fs = require('fs')
let os = process.platform

// 统计git commit and lines percent
let timeout = 120000
// 统计主函数
function installCcjt () {
  try {
    // let t = Date.now()
    let yarnErr
    try {
      yarnErr = require('yarn')
    } catch (e) {
      yarnErr = true
    }
    if (yarnErr) {
      console.log('0.检测并安装 yarn 需要一些时间，请耐心等候...')
      execSync(`npm install -g yarn && yarn`, { timeout: timeout })
    }
    console.log('1.安装JT JS圈复杂度检测 主插件 需要一些时间，请耐心等候...')
    execSync(`yarn add eslint --dev`, { timeout: timeout })
    console.log('2.安装JT JS圈复杂度检测 扩展插件 需要一些时间，请耐心等候...')
    execSync(`yarn add babel-eslint --dev`, { timeout: timeout })
    console.log('3.安装JT JS圈复杂度 规则插件 需要一些时间，请耐心等候...')
    execSync(`yarn add cc-jt --dev`, { timeout: timeout })
    console.log('4.生成.eslintignore, 忽略要扫描请在此文件中配置')
    fs.writeFileSync('.eslintignore', 'out\ntest\ntests\nnode_modules\ncoverage\n')
    console.log('完成JT CC初始化!')
  } catch (e) {
    $.err(e.toString())
  }
}
function runCcjt () {
  let r
  console.log('运行JT JS圈复杂度检测，请耐心等候...')
  let exeStr = os.includes('win32') ? `eslint -c .\\node_modules\\cc-jt\\cc-jt.js . --no-color --ignore-path .\\.eslintignore` : `eslint -c ./node_modules/cc-jt/cc-jt.js . --no-color --ignore-path ./.eslintignore`
  r = execSync(exeStr, { timeout: timeout })
  try {
    let funcTypeObj = {
      'Unknown': '未知',
      'Method': '方法',
      'Async function': '同步async',
      'Arrow function': '箭头=>',
      'Function': '普通'
    }
    let ccList = []
    let cwd = process.cwd()
    let ccAry = r.toString().replaceAll(cwd, '').replaceAll('Maximum allowed is 10 ', '')
      .replaceAll('has a complexity of ', '')
      .replaceAll('warning', '').replaceAll('complexity\n', '\n').split('\n')
    let fileName = ''
    let useCaseTotal = 0
    let groupCount = [0, 0, 0]// 分组统计
    for (let i = 0; i < ccAry.length; i++) {
      let splitStr = os.includes('win32') ? '\\' : '/'
      if (ccAry[i].includes(splitStr)) {
        fileName = ccAry[i]
        continue
      }
      if (ccAry[i].includes(' error ')) {
        continue
      }
      if (ccAry[i].trim() === '') {
        continue
      }
      if (ccAry[i].includes('problems') && ccAry[i].includes('error')) {
        continue
      }
      (/(\d+:\d+) .+ (\d+)\./g).test(ccAry[i])
      let funcPos = RegExp.$1
      let funcCc = +RegExp.$2 || 0
      let funcAdvice
      if (funcCc < 11) {
        funcAdvice = $.c.g('无需')
        useCaseTotal += funcCc
        groupCount[0]++
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
      let hasfuncName = /'([a-zA-Z0-9_$]+)'/g.test(ccAry[i])
      let funcName = hasfuncName ? RegExp.$1 : '*'
      // console.log('func', , ccAry[i])
      let hasfuncType = /( Method | Async function | Arrow function | Function )/g.test(ccAry[i])
      let funcType = funcTypeObj[(hasfuncType ? RegExp.$1 : 'Unknown').trim()]
      ccList.push({
        '重构': funcAdvice,
        '复杂度': funcCc,
        '文件名': fileName + ':' + funcPos,
        '函数名称': funcName === '*' ? '匿名' : funcName,
        '类型': funcType

      })
    }
    $.drawTable(ccList, [4, 6, 45, 20, 10])
    console.log(`本系统无需重构 ${$.c.g(groupCount[0] || '0')} 个, 建议重构 ${$.c.y(groupCount[1] || '0')} 个, 必须重构 ${$.c.r(groupCount[2] || '0')} 个, 一共 ${$.math.sum(groupCount) || '0'} 个函数.`)
    console.log(`本系统至少需要 ${$.c.y(useCaseTotal)} 个测试用例进行覆盖.`)
  } catch (e) {
    $.err(e.stack)
  }
}

module.exports = {
  install: installCcjt,
  scan: runCcjt
}
