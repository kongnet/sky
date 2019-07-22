/* eslint-disable no-unused-expressions */
/**
 * @Author: huweijian
 * @Date: 2019-07-19 16:02:03
 * @Desc: 读取api文件自动化生成前端API文件
 */
const os = require('os')
const fs = require('fs')
const $ = require('meeko')
const userInfo = os.userInfo()
const apiPath = process.cwd()
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
    // 获取每个api文件描述
    o.name = item['__swagger__'].name
    const { api, methods } = getApiContent(item)
    o.api = api
    o.methods = methods.map((item) => {
      return `${item}Axios`
    }).join(', ')
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
  console.log('content', r)
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
  const tpl = fs.readFileSync(`${__dirname}/template/api.tpl`, 'utf-8')
  // console.log('$', $)
  for (let i = 0; i < apiData.length; i++) {
    const r = tpl.render(apiData[i])
    console.log('apiFile', r)
  }
}
/**
 * 主方法
 */
function main () {
  const r = getApiInfo()
  createApiFiles(r)
  // console.log('capi', JSON.stringify(r))
}

module.exports = {
  main
}
