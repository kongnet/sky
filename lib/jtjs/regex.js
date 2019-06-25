/**
 * @Author: Christine
 * @Date: 2019-06-18 10:07:47
 * @Desc: 正则库
 */

var validRegex = function (params) {
  const regexArr = {
    // 版本号验证
    versionRegex: /^\d+\.\d+\.\d+$/,
    // 不能为空
    noEmptyRegex: /^[\s\S]*.*[^\s][\s\S]*$/,
    // 11位手机验证
    telPhoneRegex: /^1[3456789]\d{9}$/,
    // 固定电话验证
    fixedPhoneRegex: /(^0\d{2,3}-?\d{7,8}$)|(^[48]00-[0-9]{7})|(^[48]00[0-9]{7})/,
    // 邮箱验证
    emailRegex: /^[a-zA-Z0-9_.]+[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    // 中文验证
    chineseRegex: /^[\u0391-\uFFE5]+$/,
    // 两位小数验证
    towDecimalPlace: /^\d+(\.\d{1,2})?$/
  }
  const { value, type, callback } = { ...params }
  // 测试用例不存在
  if (!regexArr[type]) {
    return -2
  }
  // 开始测试
  if (regexArr[type].test(value)) {
    callback && callback()
    return 1
  } else {
    return -1
  }
}

module.exports = validRegex
