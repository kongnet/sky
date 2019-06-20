function cFn(fc, dimNum, bc, isUnderline) {
  return `\x1b[0;${isUnderline ? '4;' : ''}${dimNum ? dimNum + ';' : ''}${
    bc ? bc + ';' : ''
  }${fc || ''}m`
}
 module.exports = {
  s: {
    // 字符串
    toNumber:function (o) {
  return JSON.parse(JSON.stringify(o))
}, //转数字
    trim () {
    return this.replace(/^\s+|\s+$/g, '')
  }, //字符串前后替换空格
    copy:function (o) {
  return JSON.parse(JSON.stringify(o))
} //深度拷贝
  },
  o: {
    // 对象
    copy:function (o) {
  return JSON.parse(JSON.stringify(o))
}, //深度拷贝
    ifObjEmpty:function (o, ex) {
  ex = ex || []
  for (let i in o) {
    if (ex.includes(i)) {
      continue
    } else {
      return !1
    }
  }
  return !0
}, // 判断对象是否为空,ex是需要排除的数据数组
     isNull (o) {
    return getType.call(o) === '[object Null]'
  }, //Null判断
     isUndefined (o) {
    return getType.call(o) === '[object Undefined]'
  } //Undefined判断
  },
  n: {
    //数字
     toMoney (p) { // p精度
    let num = String(this)
    num = num.replace(new RegExp(',', 'g'), '')
    // 正负号处理
    let symble = ''
    if (/^([-+]).*$/.test(num)) {
      symble = num.replace(/^([-+]).*$/, '$1')
      num = num.replace(/^([-+])(.*)$/, '$2')
    }
    if (/^[-.0-9]+(\.[0-9]+)?$/.test(num)) {
      num = num.replace(new RegExp('^[0]+', 'g'), '')
      if (/^\./.test(num)) {
        num = '0' + num
      }
      let decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, '$1')
      let integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, '$1')
      let re = /(\d+)(\d{3})/
      while (re.test(integer)) {
        integer = integer.replace(re, '$1,$2')
      }
      if (Number(p)) {
        decimal = decimal.substr(0, Number(p) + 1)
      }
      if (p === 0) {
        decimal = ''
      }
      return symble + integer + decimal
    } else {
      return p
    }
  }, //转金额
     round (p) {
    p = Math.pow(10, p || 0)
    return Math.round(this * p) / p
  } //四舍五入
  },
  c: {
      // 控制台
      r (s, bc, u) { return cFn(31, 1, bc, u) + s + cFn() }, //错误
      g (s, bc, u) { return cFn(32, 1, bc, u) + s + cFn() }, //成功
      y (s, bc, u) { return cFn(33, 1, bc, u) + s + cFn() } //警告
  }
}