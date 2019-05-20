/**
 * @Author: Firmiana
 * @Date: 2019-04-07 12:45:42
 * @Last Modified by: Firmiana
 * @Last Modified time: 2019-04-19 14:32:25
 * @Desc: 验证类方法
 */

module.exports = {
  validataEmail,
  isValidChinese
}

/**
* 判断邮箱
* @param {String} email - 邮箱
* @returns {boolean}
*/
function validataEmail (email) {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!re.test(email)) return false
  return true
}

/**
* 校验输入内容是否是中文
* @param text 待校验内容
*/
function isValidChinese (text) {
  var re = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (!re.test(text)) return false
  return true
}
