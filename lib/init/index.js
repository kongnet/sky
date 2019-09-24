/* global $ */
const gen = require('j2dir')
const fs = require('fs')
const inquirer = require('inquirer')
// const path = require('path')
/* const StatOutFile = require('skybase-stat/outFile.js')
const ToolsOutFile = require('skybase-tools/outFile.js')
const TreeOutFile = require('skybase-tree/outFile.js')
const outFile = require('skybase/outFiles.js')
 */

// 输出主函数
/*
async function initold (option, configFile) {
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
  option.name = await getQuestion('project name:', { type: 'input', def: 'skybase-test' })
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
    gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录 , 'outDir': path.resolve(process.cwd(), projectName)

    await outFile.outProjectCode(option) // 生成其他模块

    return { templateName: templateName, ver: settingObj.ver }
  } catch (e) {
    $.err('File read Error.', e.stack)
    throw e
  }
}
*/
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
        resolve(answers.step)
      })
    } catch (e) {
      console.error(e.stack)
      resolve(false)
    }
  })
}
// 删除文件夹

function deleteall (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
};

let downloadFunc = require('download-git-repo')
async function init (option, configFile) {
  try {
    let { name: projectName, force: isForceCover, template: templateName } = option
    let downloadDir = '_temp_jt_skybase'

    let tempObj = {
      'sky': '../../exampleConfig/skyFrameworkConfig.js',
      // 'skybase': '../../exampleConfig/skybaseFramework.js',
      'skybase': `${process.cwd()}/${downloadDir}/skybaseOutFile.js`,
      'mp': '../../exampleConfig/mpJiaTuiConfig.js'
    }
    templateName = templateName || 'skybase'
    const settingPath = tempObj[templateName]
    let baseDir = [process.cwd()]
    let dirAry = fs.readdirSync(process.cwd())
    let downObj = {}
    let commandObj = {}

    /*
    templateName = templateName || 'skybase' */
    await $.wait(500)
    $.option.logTime = false
    $.log($.c.c('请耐心等待正在下载模板...'))

    downloadFunc('direct:https://github.com/kongnet/skybase-template.git', downloadDir, { clone: true }, function (err) {
      let status = err ? 'Error' : 'Success'
      downObj.status = status
    })
    await $.tools.waitNotEmpty(downObj, 'status')
    $.log('模板下载 ', downObj.status)
    if (downObj.status === 'Error') {
      $.log('请尝试删除当前目录下的 _temp_jt_skybase 目录后再次安装！')
      process.exit(0)
    }
    commandObj.proName = await getQuestion('请输入您的项目名称 [skybase-test]: ', { type: 'input', def: 'skybase-test' })
    projectName = commandObj.proName || 'skybase-test'
    if (dirAry.includes(projectName) && !isForceCover) {
      $.err(`项目路径 ${$.c.r(projectName)} 已存在! 或 使用强制参数 -f`)
      process.exit(1)
    }
    commandObj.proVersion = await getQuestion('请输入您的项目版本号 [0.1.0]: ', { type: 'input', def: '0.1.0' })
    const dateStr = new Date().date2Str().split(' ')[0]
    commandObj.proDesc = await getQuestion(`请输入您的项目详细说明 [我的项目${dateStr}]: `, { type: 'input', def: `我的项目${dateStr}` })

    let inObj = {}

    const settingObj = require(settingPath)(commandObj)
    inObj[projectName] = settingObj
    gen.genMain(inObj, baseDir, { 'templateDir': '.' })
    deleteall(`./${downloadDir}`)
    $.log('========请继续运行如下命令========\n')
    $.log($.c.y(`    cd ./${projectName}`))
    $.log($.c.y(`    npm i`))
    $.log($.c.y(`    nodemon `), $.c.dimw(`// 如果没有安装请全局安装 npm i -g nodemon`))
    $.log($.c.y(`    http://127.0.0.1:13000/skyapi/mock/first`), $.c.dimw('打开浏览器可访问'))
    $.log($.c.dimw(`    // 数据的配置在 ./${projectName}/config/config.default.js`))
    $.log($.c.y(`    http://127.0.0.1:13000/skyapi/probe/mysql`), $.c.dimw(`//正确配置数据库设置后可访问`), '\n')
    $.log('============祝您开心============')

    $.option.logTime = true
    return { templateName: templateName, ver: commandObj.proVersion || '0.1.0' }
  } catch (e) {
    console.log(e.stack)
  }
}
module.exports = {
  init
}
