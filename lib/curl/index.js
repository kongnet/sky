/* global $ */
const req = require('request-promise-native')
const cheerio = require('cheerio')
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

// 英文字典

// 循环对象
function elmForEach (arr, fn) {
  return [].forEach.call(arr, fn)
}
function elmMap (arr, fn) {
  return [].map.call(arr, fn)
}
function ul (str) {
  return Array.isArray(str) ? str.map(ul) : '- ' + str
}

function indent (str) {
  return Array.isArray(str) ? str.map(indent) : '  ' + str
}
// 字典解码函数
function parseDict (html, word) {
  let $$ = cheerio.load(html)

  let errEle = $$('#results-contents .error-wrapper')

  if (errEle.length) {
    return {
      word,
      err: 'Not Fount'
    }
  }
  let prons = elmMap($$('.pronounce .phonetic'), ele => $$(ele).text())
  let cnDefs = elmMap($$('#phrsListTab .trans-container li'), ele => $$(ele).text())
  let enDefsEle = $$('#tEETrans .trans-container > ul > li')
  let enDefs = {}
  elmForEach(enDefsEle, ele => {
    let pos = $$('.pos', ele).text()
    let defs = elmMap($$('.def', ele), ele => $$(ele).text())
    enDefs[pos] = defs
  })

  return {
    word,
    pron: {
      uk: prons[0] || '',
      us: prons[1] || prons[0] || ''
    },
    def: {
      cn: cnDefs,
      en: enDefs
    },
    audio: {
      uk: `http://dict.youdao.com/dictvoice?audio=${word}&type=1`,
      us: `http://dict.youdao.com/dictvoice?audio=${word}&type=2`
    }
  }
}
// printTermi 打印到中端
function printTermial (data) {
  // $.dir(data)
  if (data.err) {
    return console.log('Word:', $.c.g(data.word), $.c.r(data.err))
  }
  console.log($.c.g('\n' + indent(data.word) + '\n'))

  let pron = data.pron

  let prons = Object.keys(pron).filter(k => !!pron[k])
  if (prons.length) {
    prons = prons.map(k => k + ' ' + $.c.y(pron[k]) + ' 🔊   ' + $.c.c(data.audio[k]))
    console.log($.c.dimw('pronunciations'))
    console.log(indent(ul(prons)).join('\n') + '\n')
  }

  let cnDefs = data.def.cn
  if (cnDefs.length) {
    console.log($.c.dimw('🐉  definitions'))
    console.log(indent(ul(cnDefs)).join('\n') + '\n')
  }

  let enDefs = data.def.en
  let poses = Object.keys(enDefs)
  if (poses.length) {
    console.log($.c.dimw('🌎  definitions'))
    poses.forEach(pos => {
      console.log(pos)
      let defs = indent(ul(enDefs[pos])).join('\n')
      console.log(defs)
    })
  }
}
// 获取字典信息主程序
async function dict (word) {
  let rObj = {
    method: 'get',
    uri: `http://dict.youdao.com/w/${word}`
  }
  let r = await req(rObj)
  let o = parseDict(r, word)
  printTermial(o)
  return 1
}
module.exports = {
  scan,
  wttr,
  coin,
  dict
}
