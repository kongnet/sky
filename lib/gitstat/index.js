let $ = require('meeko')
const { execSync } = require('child_process')
// 统计git commit and lines percent
let timeout = 120000
// 统计主函数
function gitStat () {
  try {
    let t = Date.now()
    let r

    r = execSync(`git --no-pager log --pretty='%ae$%an' --no-merges || true`, { timeout: timeout })

    let a = r.toString().split('\n')
    let colWidth = [28, 15, 9, 9, 9, 9, 9]
    let tableData = []
    let sumDiff = 0

    let r1 = a.count()
    let r2 = {}
    for (let i in r1) {
      r2[i.replaceAll('\'', '')] = r1[i]
    }
    for (let i in r2) {
      if (i.length === 0) continue
      i = i.replaceAll('\'', '')
      let iAry = i.split('$')
      colWidth[0] = iAry[0].length > colWidth[0] ? iAry[0].length : colWidth[0]
      colWidth[1] = iAry[1].length > colWidth[1] ? iAry[1].length : colWidth[1]
      let str = `git --no-pager log --author="${iAry[0] || ''}" --pretty=tformat: --numstat`
      let r = execSync(`${str} `, { timeout: timeout })
      let a = r.toString().split('\n')
      let sumAdd = 0
      let sumMinus = 0
      for (let k = 0; k < a.length; k++) {
        let ary = a[k].split('\t')
        sumAdd += (+ary[0] || 0)
        sumMinus += (+ary[1] || 0)
      }
      sumDiff += sumAdd - sumMinus
      tableData.push({ 'email': iAry[0] || 'Unknown', 'name': (iAry[1] || '').split('\'')[0] || 'Unknown', 'commits': r2[i], '+ Lines': sumAdd, '- Lines': sumMinus, '* diff': sumAdd - sumMinus, percent: '' })
    }
    tableData = tableData.map(item => {
      let percent = ~~(item['* diff'] / sumDiff * 1000) / 10 + '%'
      return {
        'email': item.email,
        'name': item.name,
        'commits': ' '.times(colWidth[2] - (item.commits + '').length) + item.commits,
        '+ Lines': ' '.times(colWidth[3] - (item['+ Lines'] + '').length) + item['+ Lines'],
        '- Lines': ' '.times(colWidth[4] - (item['- Lines'] + '').length) + item['- Lines'],
        '* diff': ' '.times(colWidth[5] - (item['* diff'] + '').length) + item['* diff'],
        percent: ' '.times(colWidth[5] - (percent).length) + percent

      }
    })
    let tableOutput = tableData.orderBy(['* diff'], ['desc']).map(item => {
      return {
        email: item.email,
        name: item.name,
        commits: item.commits,
        '+ Lines': $.c.g(item['+ Lines']),
        '- Lines': $.c.r(item['- Lines']),
        '* Lines': $.c.y(item['* diff']),
        percent: $.c.c(item.percent)
      }
    })
    $.drawTable(tableOutput, colWidth)
    let diffTime = Date.now() - t
    console.log(diffTime < 1000 ? diffTime + ' 毫秒' : $.tools.timeAgo(t, Date.now()).split('前')[0])
  } catch (e) {
    $.err(e.toString())
  }
}

module.exports = { scan: gitStat }
