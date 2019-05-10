let $ = require('meeko')
const req = require('request-promise-native')
// get post 函数封装
async function getPost (url, m, param) {
  try {
    let reqObj = {}
    let r
    let paramObj = $.json.parse(`{${param}}`)

    if (m.toUp() !== 'POST') {
      reqObj = {
        method: 'get',
        uri: url,
        json: true,
        qs: paramObj
      }
    } else {
      reqObj = {
        method: 'post',
        uri: url,
        json: true,
        form: paramObj
      }
    }
    console.log('====== Request Param ======')
    $.dir(paramObj)
    console.log('========= Response =========')
    r = await req(reqObj)

    return r
  } catch (e) {
    $.err(e.message)
    return e.name
  }
}
// 输出主函数  file = http链接 或者 配置文件
async function scan (option) {
  // $.log(option.host, option.method, option.param)
  let r = await getPost(option.host, option.method, option.param)
  $.dir(r)
}
// 天气预报输出
async function wttr (city) {
  let rObj = {
    method: 'get',
    uri: `http://wttr.in/${city || ''}?lang=zh`,
    headers: { 'user-agent': 'curl/7.55.1', 'accept': '*/*' }
  }
  let r = await req(rObj)
  return r
}
// 加密货币汇率
async function coin (name) {
  let rObj = {
    method: 'get',
    uri: `http://rate.sx/${name || ''}`,
    headers: { 'user-agent': 'curl/7.55.1', 'accept': '*/*' }
  }
  let r = await req(rObj)
  return r
}
module.exports = {
  scan,
  wttr,
  coin
}
