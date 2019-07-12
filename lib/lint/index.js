const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
// const path = require('path')

async function writeJson (params) {
  fs.readFile('./package.json', function (err, data) {
    if (err) {
      return console.error(err)
    }
    let packageJson = data.toString()// 将二进制的数据转换为字符串
    packageJson = JSON.parse(packageJson)// 将字符串转换为json对象
    // 合并scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      ...params.scripts
    }
    // 合并devDependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...params.devDependencies
    }
    // 合并lint-staged
    packageJson['lint-staged'] = {
      ...packageJson['lint-staged'],
      ...params['lint-staged']
    }
    // 合并husky
    packageJson.husky = {
      ...packageJson.husky,
      ...params.husky
    }
    const str = JSON.stringify(packageJson, null, 2)// 因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    fs.writeFile('./package.json', str + '\n', 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  })
}

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
    const cmdFilePathArr = process.mainModule.filename.split('/')
    cmdFilePathArr.pop()
    let inObj = {}

    const settingObj = configFile || require(settingPath)
    inObj = Object.assign({}, settingObj)
    delete inObj.ver
    delete inObj.packages
    gen.genMain(inObj, baseDir, {
      'templateDir': cmdFilePathArr.join('/') + '/lib/lint/template/' + templateName }) // 模板所在目录
    // gen.printDir(baseDir, outObj)
    const { packages = {} } = settingObj
    // 写入到package.json文件中
    await writeJson(packages)
    console.log('恭喜你！\n配置文件安装完成，还需要安装一些包才能正常使用')
    console.log('\n请执行下面的命令完成开发依赖安装:')
    console.log($.c.g('npm install') + ' or ' + $.c.g('yarn'))
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
