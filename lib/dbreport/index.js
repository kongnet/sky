const SkyDB = require('j2sql2')
const fs = require('fs')
const $ = require('meeko')
let dbReport
let tableSql
let columnSql
async function initDB () {
  dbReport = JSON.parse(
    fs
      .readFileSync('db-report.json')
      .toString()
      .replaceAll('\r\n', '')
      .replaceAll(' ', '')
  )
  const skyDB = new SkyDB({
    mysql: dbReport
  })
  const db = await skyDB.mysql // 创建mysql实例
  global.db = db

  tableSql = `SELECT
  table_schema as db,
  table_name as table_name,
  table_comment as table_comment
  FROM
  information_schema.\`TABLES\`
  WHERE
  table_schema IN ( ${dbReport.reportDB.map(x => `'` + x + `'`).join(',')} );`
  columnSql = `SELECT
  table_schema AS db_name,
  table_name AS table_name,
  column_name AS column_name,
  column_type AS column_type,
  column_comment AS column_comment
  FROM
  information_schema.\`COLUMNS\`
  WHERE
  table_schema IN ( ${dbReport.reportDB.map(x => `'` + x + `'`).join(',')} )
  ORDER BY table_schema;`
}

async function allColumnList () {
  await initDB()
  let n = 1
  let r = await db.run(columnSql)
  let tableArr = r
    // .filter(item => item['db_name'].indexOf('ft') === 0) 可过滤
    .map(x => {
      return [
        n++,
        x.db_name,
        x.table_name,
        x.column_name,
        x.column_type,
        x.column_comment
      ]
    })

  let htmlStr = $.tools.genTemp.genHtml(
    '',
    $.tools.genTemp.gridTable(
      [
        {
          dataTitleArr: ['序号', '数据库名', '表名', '列名', '列类型', '注释'],
          dataArr: tableArr,
          dataTitle: '数据库表结构'
        }
      ],
      'open'
    )
  )
  fs.writeFileSync(dbReport.outputName || 'mysql-output.html', htmlStr)
}
async function tableColumnList () {
  await initDB()

  let tableResult = await db.run(tableSql)
  let tableComment = []
  tableResult.forEach(x => {
    tableComment[x.db + '=>' + x.table_name] = {
      db: x.db,
      comment: x.table_comment
    }
  })

  let n = -1
  let r = await db.run(columnSql)

  r.push({
    db_name: '$LAST$',
    table_name: '$LAST$',
    column_comment: '插入一个最后表和列'
  })

  let tableDiffName = ''

  let htmlStr = ''
  let columnArr = []
  let tableArr = r
    // .filter(item => item['db_name'].indexOf('ft') === 0) //可过滤
    .map(x => {
      if (tableDiffName !== x.table_name) {
        n++
        columnArr.push([])
        if (n > 0) {
          let dbTableName = columnArr[n - 1][0][0] + '=>' + tableDiffName
          htmlStr += $.tools.genTemp.gridTable(
            [
              {
                dataTitleArr: ['数据库名', '表名', '列名', '列类型', '注释'],
                dataArr: columnArr[n - 1],
                dataTitle:
                  dbTableName + '（' + tableComment[dbTableName].comment + '）'
              }
            ],
            'open'
          )
        }
        tableDiffName = x.table_name
      } else {
        // do nothing
      }
      columnArr[n].push([
        x.db_name,
        x.table_name,
        x.column_name,
        x.column_type,
        x.column_comment
      ])
    })

  htmlStr = $.tools.genTemp.genHtml('', htmlStr)
  fs.writeFileSync(dbReport.outputName || 'mysql-output.html', htmlStr)
  process.exit(0)
}
function initReportFile () {
  const jsonFile = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'root',
    'password': '123456',
    'database': 'mysql',
    'pool': 50,
    'timeout': 60000,
    'charset': 'utf8mb4',
    'supportBigNumbers': true,
    'multipleStatements': true,
    'connectionLimit': 500,
    'showSql': true,
    'outputName': 'mysql-output.html',
    'reportDB': ['mysql']
  }
  fs.writeFileSync('db-report.json', JSON.stringify(jsonFile, null, 2))
  process.exit(0)
}

async function mainTest () {
  // 测试函数
  await allColumnList()
  // await tableColumnList()
}
// mainTest()
module.exports = {
  allColumnList,
  tableColumnList,
  initReportFile
}
