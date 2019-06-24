/**
 * author: huweijian
 * Date: 2019/4/17 - 3:52 PM
 * Name: config
 * Desc:
 */
module.exports = {
  path: '', // 可以是相对地址
  scanFile: ['js', 'jsx', 'vue'], // 要忽略的文件类似后缀
  fileIgnores: ['node_modules', 'LICENSE', '.editorconfig', '.gitignore', '.git', '.idea', 'coverage'], // 要忽略的文件夹名或者文件名(带后缀的全命名)
  keyWordsIgnores: ['if', 'while', 'for', 'catch', 'data', 'mounted', 'beforeMount', 'beforeRouteEnter', 'return', 'switch', 'created'] // 要忽略的关键字(包括方法名)
}
