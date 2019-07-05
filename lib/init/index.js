const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
const outFile = require('./outFiles.js')

// 输出主函数
async function init(option, configFile) {
  let { name: projectName, force: isForceCover, template: templateName } = option
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
    option.name = projectName
    if (dirAry.includes(projectName) && !isForceCover) {
      $.err(`Project path ${$.c.r(projectName)} already exist!`)
      process.exit(1)
    }
    let inObj = {}

    const settingObj = configFile || require(settingPath)
    inObj[projectName] = settingObj
    gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录

    await outFile.outProjectCode(option) // 生成其他模块

    return { templateName: templateName, ver: settingObj.ver }
  } catch (e) {
    $.err('File read Error.', e.stack)
    throw e
  }
}

module.exports = {
  init
}
