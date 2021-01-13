/* eslint-disable no-unused-expressions */
/**
 * @Author: huweijian
 * @Date: 2019-07-19 16:02:03
 * @Desc: 读取api文件自动化生成前端API文件
 */

const os = require('os')
const fs = require('fs')
const path = require('path')

const $ = require('meeko')
const userInfo = os.userInfo()
const apiPath = resolvePath(process.cwd(), './model/api')
// 预定义放置api文件的文件夹
const apiFilesPath = resolvePath(process.cwd(), './frontApiFiles')
// 工具方法
/**
 * 格式化路径
 * @param file
 * @returns {*}
 */

function resolvePath (pathDir, file) {
  return path.resolve(pathDir, file)
}

/**
 * 删除目标文件下所有文件
 */

function delDir (path) {
  // 如果目标文件存在
  if (fs.existsSync(path)) {
    let files = fs.readdirSync(path)
    files.forEach(item => {
      let currPath = resolvePath(path, item)
      if (fs.statSync(currPath).isDirectory()) {
        // 如果该路径是文件夹删除其目录下所有文件
        delDir(currPath)
      } else {
        // 如果文件路径则删除文件
        fs.unlinkSync(currPath)
      }
    })
    // fs.rmdirSync(path)
  }
}
// 解析api结构
/**
 * 读取目标路径API文件，并分析
 */

function getApiInfo () {
  // 读取当前执行命令下的api文件
  let r = []
  const apiInfo = $.requireAll(apiPath)
  // 遍历所有接口并分析
  for (let k in apiInfo) {
    // console.log(apiInfo[k])
    let item = apiInfo[k]
    let o = {}
    // 或取用户名
    o.username = userInfo.username
    // 获取当前时间
    o.time = $.now().format('yyyy-MM-dd hh:mm:ss')
    const swagger = item.__swagger__ || {}

    // 获取每个api文件描述
    o.name = swagger.description
    o.desc = swagger.name
    const { api, methods } = getApiContent(item)
    o.api = api
    o.methods = methods
      .map(item => {
        return `${item}Axios`
      })
      .join(', ')
    // console.log('o', o)
    r.push(o)
  }
  return r
}

/**
 * 重组调用接口的函数名
 *
 * @param {*} url 接口地址
 * @param {*} action 动作
 * @returns
 */

function getFuncName (url, action) {
  const str = url.match(/\w+$/)[0]
  const reg = new RegExp(`^${action}[A-Z]`)
  return reg.test(str) ? str : `${action}${str.upperFirst()}`
}

/**
 * 重组api接口参数
 * @param {*} info
 * @returns r { object }
 */

function getApiContent (info) {
  let obj = { ...info }
  let methodObj = {}
  delete obj.__swagger__
  let r = []
  // 遍历文件内每个接口
  for (let k in obj) {
    const item = obj[k]
    if (item.front) {
      const params = getApiParams(item.param)

      let o = {
        url: k,
        name: item.name,
        funcName: getFuncName(k, item.action),
        method: item.method,
        params,
        paramsRule: item.param
      }
      methodObj[item.method] = 1
      r.push(o)
    }
  }
  // console.log('content', r)
  return {
    api: r,
    methods: Object.keys(methodObj)
  }
}

/**
 * 转接口参数为数组类型
 * @param {*} params
 * @returns r { array }
 */

function getApiParams (params = {}) {
  let r = []
  for (let k in params) {
    r.push({
      name: k,
      ...params[k]
    })
  }
  return r
}

// 产生文档
function createApiFiles (apiData) {
  // 获取api模板
  const tpl = fs.readFileSync(
    resolvePath(__dirname, './template/api.tpl'),
    'utf-8'
  )
  // 循环遍历接口内容并写入文件
  for (let i = 0; i < apiData.length; i++) {
    const item = apiData[i]
    const r = tpl.render(item)
    let filePath = resolvePath(apiFilesPath, `${item.name}.js`)
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath)
    // }
    fs.writeFileSync(filePath, r, 'utf-8')
  }
}

/**
 * 主方法
 */

function main () {
  // 查看目标文件夹是否存在，若存在则尝试删除其目录下所有已生成的文件
  if (fs.existsSync(apiFilesPath)) {
    delDir(apiFilesPath)
  } else {
    fs.mkdirSync(apiFilesPath)
  }
  // 获取api接口信息
  const r = getApiInfo()
  // 生成api文件
  createApiFiles(r)
  // console.log('capi', JSON.stringify(r))
}

module.exports = {
  main
}
