let $ = require('meeko')
let fs = require('fs')
const { resolvePath } = require('../../tools/utils')
const config = require('./config')
const path = resolvePath(config.path)

// meeko内置方法，未暴露出来
const cFn = function cFn(fc, dimNum, bc, isUnderline) {
  return `\x1b[0;${isUnderline ? '4;' : ''}${dimNum ? dimNum + ';' : ''}${
    bc ? bc + ';' : ''
  }${fc || ''}m`
}

// TODO:有些方法是匿名函数要处理下

let str = ` {
  s: {
    // 字符串
    toNumber:${$.tools.copy.toString()}, //转数字
    ${''.trim.toString()}, //字符串前后替换空格
    copy:${$.tools.copy.toString()} //深度拷贝
  },
  o: {
    // 对象
    copy:${$.tools.copy.toString()}, //深度拷贝
    ifObjEmpty:${$.tools.ifObjEmpty.toString()}, // 判断对象是否为空,ex是需要排除的数据数组
     ${$.tools.isNull.toString()}, //Null判断
     ${$.tools.isUndefined.toString()} //Undefined判断
  },
  n: {
    //数字
     ${''.toMoney.toString()}, //转金额
     ${(1).round.toString()} //四舍五入
  },
  c: {
      // 控制台
      ${$.c.r.toString()}, //错误
      ${$.c.g.toString()}, //成功
      ${$.c.y.toString()} //警告
  }
}`

let jsbody = `;(function (global, factory) {
  // CommonJS、CMD规范检查
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  // AMD规范检查
  typeof define === 'function' && define.amd ? define(factory) : (global.Jtjs = factory());
}(this, (function () { 'use strict';
     ${cFn.toString()}\n
    let Jtjs = ${str}
    return Jtjs
} )))`

function writeFileSync(configPath) {
  console.log($.c.c(`===== start export =====`))
  fs.writeFileSync(configPath || path, jsbody, function(err) {
    if (!err) {
      console.log('成功！')
    }
  })
  console.log($.c.c(`===== end export =====`))
  console.log($.c.g('✔'), '成功导出工具库！')
}

module.exports = {
  writeFileSync
}
// console.log(str)
