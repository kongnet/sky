let $ = require('meeko')
const req = require('request-promise-native')
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
    console.log('========= Respone =========')
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

module.exports = {
  scan
}
