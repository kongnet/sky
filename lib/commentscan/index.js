/**
 * author: huweijian
 * Date: 2019/4/11 - 10:13 AM
 * Name: index
 * Desc: 入口
 */
const $ = require('meeko')
const fs = require('fs')
const path = require('path')
/**
 * 格式化路径
 * @param file
 * @returns {*}
 */
function resolvePath (file) {
  return path.resolve(process.cwd(), file)
}

const config = require('./config')
let dirPath = resolvePath(config.path)
let fileIgnores = config.fileIgnores
let keyWordsIgnores = config.keyWordsIgnores
let scanFile = config.scanFile
// 延迟执行读文件内容方法
let pathArr = []
let pathArrLen = 0
let fileCount = 0
let errFuncAry = []

/**
 * 读取要扫描的所有文件目录
 * @param name
 */
function readAllFiles (name = '') {
  let path = name || dirPath
  // console.log('path', path)
  if (!fs.statSync(path).isDirectory()) {
    pathArr.push(path)
    return
  }
  let dir = fs.readdirSync(resolvePath(path))

  for (let i = 0; i < dir.length; i++) {
    let item = dir[i]
    // console.log('item', item)
    // console.log('fileIgnores', fileIgnores)
    if (!fileIgnores.includes(item)) {
      if (!~item.indexOf('.')) {
        readAllFiles(`${path}/${item}`)
      } else {
        // console.log(dir.length === i + 1)
        let typeMatch = item.match(/\.(\w+)$/)
        let type = typeMatch ? typeMatch[1] : ''
        if (scanFile.includes(type)) {
          pathArr.push(`${path}/${item}`)
        }
      }
    }
  }
}

/**
 * 扫描
 */
function scan () {
  // console.log($.c.c(`===== start scan =====`))

  let totalErr = 0
  pathArr.forEach(file => {
    // console.log('file', file)
    let errFlag = 0
    let str = fs.readFileSync(resolvePath(file), 'utf-8')
    fileCount++
    process.send({ type: 'scanning', msg: `(${fileCount}/${pathArrLen}) ${~~(fileCount / pathArrLen * 100)} %  Error Function: ${$.c.r(totalErr)}` })
    // console.log(str.match(/data/))
    let index = 0
    let strn = str.replace(/((\r?)\n)/g, $1 => {
      index++
      return `_${index}_\n`
    })
    if (/\.vue$/.test(file)) {
      strn = strn
        .replace(/\/\*\*[\s\S]+?<\/template>/, '')
        .replace(/<style[\s\S]+?<\/style>/, '')
    }
    // console.log(strn.match(/data/))
    // 这里的正则有点复杂
    // \/\*\*[\s\S]+?\*\/\n\s+ 匹配 /** 开头 */结尾的
    // (\/\*\*[\s\S]+?\*\/\n\s+|(\/\/.+?\n\s+)+)?(async)?(\s)*?\(.*?\)(\s)*?=>(\s)*\{ 匹配箭头函数
    // (\/\*\*[\s\S]+?\*\/\n\s+|(\/\/.+?\n\s+)+)?function(\s)*\(.*?\)(\s)*\{ 匹配function关键字函数
    // (\/\/.+?\n\s+)+)?\w+(\s)*\(.*?\)(\s)*\{ 匹配 xxx () {}形式的省略function关键字的函数
    // (\/\*\*[\s\S]+?(\*)+\/\n\s+|(\/\/.+?\n+\s+)+)?(export)\s+?function(\s)*\(.*?\)(\s)*\{
    //  ?(\s+\w+\s+\(.*?\)\s*{_\d+_)
    // (\/\*\*[\s\S]+?(\*)+\/(_\d+_)\n+|(\/\/.*?(_\d+_)\n+))?(async)?(\s)*?\(.*?\)(\s)*?=>(\s)*\{_\d+_| 箭头函数
    // (\/\*\*[\s\S]+?(\*)+\/(_\d+_)\n+|(\/\/.*?(_\d+_)\n+))?(export\s)?(function\s)?\w+\s+\(.*?\)\s+{_\d+_| function函数
    // |(\/\/.*?(_\d+_)\n+)
    let func =
      strn.match(
        /(\/\*\*[\s\S]+?(\*)+\/(_\d+_)\n+|(\/\/.*?(_\d+_)\n+))?(async)?(\s)*?\(.*?\)(\s)*?=>(\s)*\{.*?_\d+_|(\/\*\*[\s\S]+?(\*)+\/(_\d+_)\n+|(\/\/.*?(_\d+_)\n+))?(export\s|async\s)?(function\s)?\w+\s+\(.*?\)\s+{.*?_\d+_|(\/\*\*[\s\S]+?_\d+_\n\s*\*\/_\d+_\n\s*?|(\/\/.*?(_\d+_)\n+))?\s*\w+\s*\(.*?\)\s+{.*?_\d+_/g
      ) || []
    // console.log('func', func)
    // let arr = str.split('\n')
    func.forEach(item => {
      item = item.replace(/^\n\s+/, '')
      // console.log('item', item)
      let match = item.match(/^\w+(?=\(?\)?\s)/g)
      let key = match ? match[0] : ''
      // console.log('key', key)
      if (key && !keyWordsIgnores.includes(key) && /^(\w+)/.test(item)) {
        let line = item.match(/_(\d+)_/)[0].replace(/_/g, '')
        let name = item.split('{')[0]
        // console.log(
        //   $.c.r('✘'),
        //   `${$.c.r(file + ':' + line)} 行 ${$.c.r(name)} 没有注释`
        //  )
        errFuncAry.push(`${$.c.r(file + ':' + line)} 行 ${$.c.r(name)} 没有注释`)
        errFlag = 1
        totalErr++
      }
    })
    if (errFlag === 0) {
      // console.log($.c.g('✔'), file)
    }
  })

  process.send({ type: 'end', msg: '', totalErr: totalErr })
  if (totalErr) {
    console.log(errFuncAry.join('\n'))
  }
}
// 主函数
function main (configPath = '') {
  let config = configPath ? require(resolvePath(configPath)) : {}
  dirPath = config.path || dirPath
  fileIgnores.push(...(config.fileIgnores || []))
  keyWordsIgnores.push(...(config.keyWordsIgnores || []))
  scanFile.push(...(config.scanFile || []))
  readAllFiles()
  pathArrLen = pathArr.length
  process.send({ type: 'prescan', msg: pathArrLen })
  scan()
}
module.exports = {
  scan: main
}
