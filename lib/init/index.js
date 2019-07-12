/* global $ */
const gen = require('j2dir')
const fs = require('fs')
const StatOutFile = require('skybase-stat/outFile.js')
const ToolsOutFile = require('skybase-tools/outFile.js')
const TreeOutFile = require('skybase-tree/outFile.js')
const outFile = require('skybase/outFiles.js')
const inquirer = require('inquirer')

// 输出主函数
async function init (option, configFile) {
  option.initModelsMap = {} // map modelName ---> modelFunc

  let modelsMap = {
    'stat': StatOutFile, // 增加统计模块
    'tools': ToolsOutFile, // 增加各种工具模块
    'tree': TreeOutFile // 增加 树操作CURD
  }
  let choices = []
  for (let v in modelsMap) {
    choices.push({ name: v, checked: true })
  }
  option.name = await getQuestion('project name:', { type: 'input', def: 'sky-test' })
  let addModelsList = await getQuestion('select add model:', { type: 'checkbox', choices })
  addModelsList.map((v) => { option.initModelsMap[v] = modelsMap[v] })

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
    option.dirName = __dirname
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

// 获取问题 return answer
async function getQuestion (question, { type = 'confirm', def = 'output', choices = [] }) {
  return new Promise(function (resolve) {
    try {
      let prompt = inquirer.createPromptModule()
      let questions = [
        {
          type,
          name: 'step',
          default: def,
          message: $.c.c(question),
          choices
        }]
      prompt(questions).then(answers => {
        resolve(answers['step'])
      })
    } catch (e) {
      console.error(e.stack)
      resolve(false)
    }
  })
}

module.exports = {
  init
}
