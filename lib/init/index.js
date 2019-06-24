const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
// 输出主函数
async function init (projectName, isForceCover, templateName, configFile) {
  try {
    let tempObj = {
      'sky': '../../exampleConfig/skyFrameworkConfig.js',
      'mp': '../../exampleConfig/mpJiaTuiConfig.js'
    }
    templateName = templateName || 'sky'
    const settingPath = tempObj[templateName]
    let baseDir = [process.cwd()]
    let dirAry = fs.readdirSync(process.cwd())
    projectName = projectName || 'output'
    if (dirAry.includes(projectName) && !isForceCover) {
      $.err(`Project path ${$.c.r(projectName)} already exist!`)
      process.exit(1)
    }
    let inObj = {}

    const settingObj = configFile || require(settingPath)
    inObj[projectName] = settingObj
    gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录
    // gen.printDir(baseDir, outObj)
    return { templateName: templateName, ver: settingObj.ver }
  } catch (e) {
    $.err('File read Error.')
    throw e
  }
}
module.exports = {
  init
}
