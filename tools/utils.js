/**
 * author: huweijian
 * Date: 2019/4/11 - 10:18 AM
 * Name: utils
 * Desc: 工具方法
 */
const path = require('path')
/**
 * 格式化路径
 * @param file
 * @returns {*}
 */
function resolvePath (file) {
  return path.resolve(__dirname, file)
}

module.exports = {
  resolvePath
}
