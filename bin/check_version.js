let $ = require('meeko')
const req = require('request-promise-native')
let Pack = require('../package.json')

// 版本号检测
async function checkVersion () {
  let r = await req({
    method: 'get',
    uri: 'https://raw.githubusercontent.com/kongnet/sky/master/package.json',
    timeout: 2000
  })
  let verLocal = Pack.version.split('.')
  let s1 = verLocal.reduce((x, y, idx) => +x * 10 ** (4 - idx) + +y * 10 ** (3 - idx))
  let ver = JSON.parse(r.replaceAll('\n', '')).version.split('.')
  let s2 = ver.reduce((x, y, idx) => +x * 10 ** (4 - idx) + +y * 10 ** (3 - idx))
  if (s2 > s1) {
    console.log('新版本发现', verLocal.join('.'), '=>', $.c.m(ver.join('.')), $.c.c(' npm i -g skyjt '))
  }
}
checkVersion()
let errStackFn = e => {
  let str = e.toString()
  if (!str.includes('TIMEDOUT') && !str.includes('ENOTFOUND')) {
    $.err(e.toString())
  }
}
process.on('uncaughtException', errStackFn)
process.on('unhandledRejection', errStackFn)
