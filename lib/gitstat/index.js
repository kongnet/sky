let $ = require('meeko')
const { execSync } = require('child_process')
// 统计git commit and lines percent
let timeout = 120000
function gitStat () {
  let t = Date.now()
  let r = execSync(`git --no-pager log --pretty='%ae$%an' --no-merges || true`, { timeout: timeout })
  let a = r.toString().split('\n')
  let colWidth = [28, 15, 8, 8, 8, 8, 8]
  let tableData = []
  let sumDiff = 0

  let r1 = a.count()
  for (let i in r1) {
    if (i.length === 0) continue
    let str = `git --no-pager log --author="${i.split('$')[0].split('\'')[1] || ''}" --pretty=tformat: --numstat`
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
    tableData.push({ 'email': i.split('$')[0].split('\'')[1] || 'Unknown', 'name': (i.split('$')[1] || '').split('\'')[0] || 'Unknown', 'commits': r1[i], '+ Lines': sumAdd, '- Lines': sumMinus, '* diff': sumAdd - sumMinus, percent: '' })
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
  $.drawTable(tableData.orderBy(['* diff'], ['desc']), colWidth)
  console.log(Date.now() - t, 'ms')
}

module.exports = { scan: gitStat }
