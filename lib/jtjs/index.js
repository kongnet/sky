/* global $ */
let fs = require('fs')
const validRegex = require('./regex')
const path = require('path')

function resolvePath (file) {
  return path.resolve(process.cwd(), file)
}

const config = require('./config')
const ph = resolvePath(config.path)

// 下面的函数式为输出到文档服务的
const cFn = function (s, fc, dimNum, bc, isUnderline) {
  return `${isUnderline ? '\x1b[4m' : ''}${dimNum ? `\x1b[${dimNum}m` : ''}${fc ? `\x1b[${fc}m` : '\x1b[37m'}${bc ? `\x1b[${bc}m` : ''}${s || ''}\x1b[0m`
}

// 日期函数
function getFirstWeekBegDay (year) {
  let tempdate = new Date(year, 0, 1)
  let temp = tempdate.getDay()
  if (temp === 1) {
    return tempdate
  }
  temp = temp === 0 ? 7 : temp
  tempdate = tempdate.setDate(tempdate.getDate() + (8 - temp))
  return new Date(tempdate)
}

function getWeekIndex (dateobj) {
  let firstDay = getFirstWeekBegDay(dateobj.getFullYear())
  if (dateobj < firstDay) {
    firstDay = getFirstWeekBegDay(dateobj.getFullYear() - 1)
  }
  let d = Math.floor((dateobj.valueOf() - firstDay.valueOf()) / 86400000)
  return Math.floor(d / 7) + 1
}
function format (s = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'w+': getWeekIndex(this), // 周
    'W+': getWeekIndex(this), // 周
    'd+': this.getDate(), // 日
    'D+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
    X: +this / 1000 | 0 // unix秒
  }
  if (/([yY]+)/.test(s)) {
    s = s.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(s)) {
      s = s.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return s
}

function dateOffset (interval, number) {
  let me = this
  let k = {
    y: 'FullYear',
    q: 'Month',
    M: 'Month',
    w: 'Date',
    d: 'Date',
    h: 'Hours',
    m: 'Minutes',
    s: 'Seconds',
    ms: 'MilliSeconds'
  }
  let n = {
    q: 3,
    w: 7
  }
  me['set' + k[interval]](me['get' + k[interval]]() + (n[interval] || 1) * number)
  return me
}

let ext // 这个变量只是为了 通过代码检测
let protoExt = function (proto) {
  ext(Array.prototype, proto.a)
  ext(Date.prototype, proto.d)
  ext(Number.prototype, proto.n)
  ext(String.prototype, proto.s)
}
let [_a, _d, _n, _s] = [$._proto_.a, $._proto_.d, $._proto_.n, $._proto_.s]
let jsBody = `;(function (global, factory) {
  // CommonJS、CMD规范检查
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  // AMD规范检查
  typeof define === 'function' && define.amd ? define(factory) : (global.jtjs = factory());
}(this, (function () {
  'use strict'
  // 终端打印配色函数
  const cFn = ${cFn.toString()}\n
  const c = {
    ${$.c.r},
    ${$.c.g},
    ${$.c.y},
    ${$.c.b},
    ${$.c.m},
    ${$.c.c},
    ${$.c.w}
  }
  // 数组展开函数
  const flatten = (arr) => arr.reduce((a, v) => a.concat(Array.isArray(v) ? flatten(v) : v), [])
  //日期函数
  ${getFirstWeekBegDay.toString()}\n
  ${getWeekIndex.toString()}\n
  ${format.toString()}\n
  ${dateOffset.toString()}\n
  // 原型扩展函数 运行时不覆盖已有方法
  ${$.ext.toString()}\n
  let protoExt = ${protoExt.toString()}\n
  // 原型扩展函数体
  let _proto_ = {
    a:{
      ${_a.copy},
      ${_a.count},
      ${_a.flatten},
      ${_a.groupBy},
      ${_a.orderBy},
      ${_a.equals},
      ${_a.unique},
      ${_a.intersect},
      ${_a.union},
      ${_a.except},
      ${_a.subset},
      ${_a.mean},
      ${_a.median},
      ${_a.shuffle},
      ${_a.remove}

    },
    d:{
      ${_d.format},
      ${_d.date2Str},
      ${_d.getWeek},
      ${_d.date8},
      ${_d.dateAdd},
      ${_d.offset}
    },
    n:{
      ${_n.round},
      ${_n.isPrime},
      ${_n.fillStr}
    },
    s:{
      ${_s.fillStr},
      ${_s.toMoney},
      ${_s.replaceAll},
      ${_s.toLow},
      ${_s.toUp},
      ${_s.esHtml},
      ${_s.toHtml},
      ${_s.reHtml},
      ${_s.times},
      ${_s.format},
      ${_s.len},
      ${_s.toInt},
      ${_s.trim},
      ${_s.camelize},
      ${_s.ec},
      ${_s.tc},
      ${_s.dc},
      ${_s.ac},
      ${_s.upperFirst}
    }
  }
  protoExt (_proto_)

  // 其他扩展函数
  let jtjs = {
    c: c,
    r: ${validRegex.toString()}
  }
  return jtjs
} )))`

function writeFile (configPath) {
  fs.writeFileSync(configPath || ph, jsBody)
  console.log($.c.g('✔'), '成功创建 jt.js')
  // console.log(jsBody)
}

module.exports = {
  writeFile
}
