const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
const path = require('path')
// 输出主函数
async function init(projectName, isForceCover) {
  const settingPath = './setting.js'
  let baseDir = [process.cwd()]
  let dirAry = fs.readdirSync(process.cwd())
  projectName = projectName || 'output'
  if (dirAry.includes(projectName) && !isForceCover) {
    $.err(`Project path ${$.c.r(projectName)} already exist!`)
    process.exit(1)
  }
  let inObj = {}
  const defaultSetting = require(settingPath)
  inObj[projectName] = defaultSetting
  gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录
  // gen.printDir(baseDir, outObj)
}

// 输出主函数
async function initWithConfig(projectName, defaultSetting, isForceCover) {
  let baseDir = [process.cwd()]
  let dirAry = fs.readdirSync(process.cwd())
  projectName = projectName || 'output'
  if (dirAry.includes(projectName) && !isForceCover) {
    $.err(`Project path ${$.c.r(projectName)} already exist!`)
    process.exit(1)
  }
  let inObj = {}
  inObj[projectName] = defaultSetting
  gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录
  // gen.printDir(baseDir, outObj)
}

module.exports = {
  init,
  initWithConfig
}
