let $ = require('meeko')
const req = require('request-promise-native')

async function getUrl (url) {
  try {
    return await req({
      method: 'GET',
      uri: url,
      json: true
    })
  } catch (e) {
    return false
  }
}

// 输出主函数  file = http链接 或者 配置文件
async function scan () {
  let d = new Date()
  let month = d.getMonth() + 1
  let date = d.getDate()
  let r = (await getUrl(`http://www.jiahengfei.cn:33550/port/history?dispose=easy&key=jiahengfei&month=${month}&day=${date}`)).data
  let o = {}
  r.map(item => {
    return { year: +item.year, title: item.title }
  }).orderBy(['year'], ['asc'])
    .map(item => {
      o[item.year + '年'] = item.title
    })

  $.dir(o)
}
module.exports = {
  scan
}
