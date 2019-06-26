let $ = require('meeko')
const { execSync } = require('child_process')
// 统计git commit and lines percent
let timeout = 120000
// 统计主函数
function installCzjt () {
  try {
    let t = Date.now()
    let r
    console.log('安装JT commit规范 需要一些时间，请耐心等候...')
    r = execSync(`npm install -g commitizen && commitizen init cz-jt --save-dev --force`, { timeout: timeout })

    // let a = r.toString().split('\n')
    console.log(r.toString())
  } catch (e) {
    $.err(e.toString())
  }
}

module.exports = { install: installCzjt }
