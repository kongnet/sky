const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
// 输出主函数
async function generate (projectName, isForceCover, templateName, configFile) {
  try {
    let tempObj = {
      'vue': '../../exampleConfig/lintVueConfig.js',
      'weex': '../../exampleConfig/lintWeexConfig.js',
      'mp': '../../exampleConfig/lintMpConfig.js',
      'react': '../../exampleConfig/lintReactConfig.js'
    }
    templateName = templateName || 'vue'
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
    inObj[projectName] = Object.assign({}, settingObj)
    delete inObj[projectName].ver
    delete inObj[projectName].packages
    gen.genMain(inObj, baseDir, { 'templateDir': 'lib/lint/template/' + templateName  }) // 模板所在目录
    // gen.printDir(baseDir, outObj)
    const { packages = [] } = settingObj
    console.log('恭喜你！\n配置文件安装完成，还需要安装一些包才能正常使用')
    console.log('\nA.如果使用npm请执行下面的命令完成开发依赖安装:')
    console.log($.c.g('npm install -D ' + packages.join(' ')))
    console.log('\nB.如果使用yarn请执行下面的命令完成开发依赖安装:')
    console.log($.c.g('yarn add -D ' + packages.join(' ')))
    console.log('\n')
    return { templateName: templateName, ver: settingObj.ver }
  } catch (e) {
    $.err('File read Error.')
    throw e
  }
}
module.exports = {
  generate
}
