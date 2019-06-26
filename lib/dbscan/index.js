'use strict'
global.Promise = require('bluebird')
let path = require('path')
let $ = require('meeko')
let conf
let db

const keyword = [
  'ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC', 'ASENSITIVE', 'BEFORE', 'BETWEEN',
  'BINARY', 'BLOB', 'BOTH', 'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE', 'CHAR', 'CHARACTER',
  'COLLATE', 'COLUMN', 'CONDITION', 'CONNECTION', 'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE',
  'CROSS', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'FOR',
  'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MICROSECOND', 'DAY_MINUTE', 'DAY_SECOND', 'DECLARE',
  'DEC', 'DECIMAL', 'DEFAULT', 'DELAYED', 'DELETE', 'DESC', 'DESCRIBE', 'DETERMINISTIC', 'DISTINCT',
  'DISTINCTROW', 'DIV', 'DOUBLE', 'DROP', 'DUAL', 'EACH', 'ELSE', 'ELSEIF', 'ENCLOSED', 'ESCAPED',
  'EXISTS', 'EXIT', 'EXPLAIN', 'FALSE', 'FETCH', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FORCE', 'FOREIGN',
  'FROM', 'FULLTEXT', 'GOTO', 'GRANT', 'GROUP', 'HAVING', 'HIGH_PRIORITY', 'HOUR_MICROSECOND',
  'HOUR_MINUTE', 'HOUR_SECOND', 'IF', 'IGNORE', 'IN', 'INDEX', 'INFILE', 'INNER', 'INOUT', 'OUT',
  'INSENSITIVE', 'INSERT', 'INT', 'INT1', 'INT2', 'INT3', 'INT4', 'INT8', 'INTEGER', 'INTERVAL',
  'INTO', 'IS', 'ITERATE', 'JOIN', 'KEY', 'KEYS', 'KILL', 'LABEL', 'LEADING', 'LEAVE', 'LEFT',
  'LIMIT', 'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK', 'LONG', 'LOOP',
  'LONGBLOB', 'LONGTEXT', 'LOW_PRIORITY', 'MATCH', 'MEDIUMBLOB', 'MEDIUMINT', 'MEDIUMTEXT',
  'MIDDLEINT', 'MINUTE_MICROSECOND', 'MINUTE_SECOND', 'MOD', 'MODIFIES', 'NATURAL', 'NOT', 'OR',
  'NO_WRITE_TO_BINLOG', 'NUMERIC', 'PROCEDURE', 'PURGE', 'RAID0', 'RANGE', 'ZEROFILL', 'LIKE',
  'ON', 'OPTIMIZE', 'OPTION', 'OPTIONALLY', 'ORDER', 'OUTER', 'OUTFILE', 'PRECISION', 'PRIMARY',
  'READ', 'READS', 'REAL', 'REFERENCES', 'REGEXP', 'RELEASE', 'RENAME', 'REPEAT', 'REPLACE',
  'REQUIRE', 'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'RLIKE', 'SCHEMA', 'SCHEMAS', 'BIGINT',
  'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE', 'SEPARATOR', 'SET', 'XOR', 'YEAR_MONTH', 'CHECK',
  'SHOW', 'SMALLINT', 'SPATIAL', 'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING',
  'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL', 'STARTING', 'NULL',
  'STRAIGHT_JOIN', 'TABLE', 'TERMINATED', 'THEN', 'UTC_TIMESTAMP', 'VALUES', 'VARBINARY',
  'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRIGGER', 'TRUE', 'UNDO', 'UNION',
  'UNIQUE', 'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE', 'USE', 'USING', 'UTC_DATE', 'UTC_TIME',
  'VARCHAR', 'VARCHARACTER', 'VARYING', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WRITE', 'X509'
]
let wait = $.wait
// 等待函数
async function waitNotEmpty (o, prop, fn) {
  fn = fn || function () { }
  if (!o[prop]) {
    fn(o, prop)
    await wait(100)
    await waitNotEmpty(o, prop, fn)
  }
}
// 获取全部 db 列表或者 conf 设置中的db列表
async function getDB (conf) {
  let r = conf.checkDB.length > 0 ? conf.checkDB : (await db.cmd('show databases;').run())[1]
  return r
}
// 获取全部 db 中所有table列表
async function getTable (dbName) {
  let sql = `select TABLE_NAME as name, TABLE_COMMENT as comment from INFORMATION_SCHEMA.Tables
  where table_schema = '${dbName}';`
  let r = await db.cmd(sql).run()
  return r
}
// 获取全部 table 中所有field列表
async function getField (dbName, tableName) {
  let sql = `use \`${dbName}\`;show full columns from \`${tableName}\`;`
  let r = (await db.cmd(sql).run())[1]
  return r
}
// 是否包含大写字母
function ifUppercase (str) {
  return (/[A-Z]+/m).test(str)
}
// 是否包含大写字母
function ifKeyword (str) {
  return conf.keyword.includes(str.toUpperCase())
}
// 字段是否没有注解
function ifNoComment (field) {
  return field.Comment.length < 1 && field.Field !== 'id'
}
// 是否包含不允许的特殊字符
function ifExcludeWord (str) {
  return conf.excludeWord.some(function (it) {
    return str.includes(it)
  })
}
// 是首位是数字
function ifHeadNum (str) {
  return (/^[0-9]+/m).test(str)
}
// 下划线太多了
function ifUnderlineMany (str) {
  return str.split('_').length > 4
}
// 不使用 float 和 double
function ifDecimal (str) {
  return str.includes('float') || str.includes('double')
}
// 末尾不为复数 带s
function ifPlural (str) {
  return (/s$/m).test(str) && !conf.excludePlural.some(function (it) {
    return str.includes(it)
  })
}
// 开头和末尾不为下划线
function ifHeadRearUnderline (str) {
  return (/_$/m).test(str) || (/^_/m).test(str)
}
// 必须有默认值
function noDefaultValue (field) {
  return !conf.exDefaultType.some(function (it) {
    return field.Type.includes(it)
  }) && !field.Field.includes('id') && // 字段中含有id
  field.Default === null
}
// 是否以is_开头字段
function fieldIncludeIs (field) {
  let b1 = (/^is_/m).test(field.Field) && (!field.Type.includes('tinyint') || !field.Comment.includes('是否'))
  let b2 = field.Comment.includes('是否') && (!(/^is_/m).test(field.Field) || !field.Type.includes('tinyint'))
  return b1 || b2
}
// 枚举型字段的判断
function fieldEnum (field) {
  let isHead = (/^(stat|type|enum)_/gm).test(field.Field)
  let isRear = (/_(stat|type|enum)$/gm).test(field.Field)
  let isComment = (/\[[\s\S]+\]/gm).test(field.Comment)
  let isType = field.Type.includes('tinyint') || field.Type.includes('varchar')

  let b1 = isHead && !isType
  let b2 = isRear && !isType
  let b3 = isHead && !isComment
  let b4 = isRear && !isComment
  let b5 = isComment && !(isHead || isRear)
  /* if (field.Field === 'old_source_type') {
    $.log(field.Comment)
    $.log(b1, b2, b3, b4, b5)
  } */

  return b1 || b2 || b3 || b4 || b5
}
// 主入口
async function scan (file, jsonObj) {
  const errGroup = {
    'Lev1': {
      '0x10': ['表/字段，无注解'], // 除了id
      '0x20': ['库/表/字段，必须全小写'],
      '0x30': ['库/表/字段，与关键字冲突'],
      '0x40': ['库/表/字段，不可包含某些字符'], // conf.excludeWord
      '0x50': ['库/表/字段，首位不可为数字'],
      '0x60': ['库/表/字段下划线不能多于3个'],
      '0x70': ['字段不能为float和double类型,必须为decimal'],
      '0x80': ['注解含有是否，必须以is_开头,数据类型tinyint,反之依然'],
      '0x90': ['注解含有[xxx],为枚举，必须以(enum/stat/type)_xxx开头或结尾,数据类型tinyint或varchar,反之依然'],
      '0xA0': ['字段除了是id，或类型除了datetime、text等,必须有默认值'],
      '0xB0': ['库/表/字段不能以下划线开头或者结尾']
      /* timestamp、datetime、smalldatetime
      uniqueidentifier
      binary、sql_variant、binary 、varbinary、image
      */
    },
    'Lev2': {
      '0xC0': ['表不能为复数形式'] // 可能结尾有s单词
    },
    'Lev3': {
      '0xD0': ['框架必须字段'],
      '0xE0': ['索引名只能以pk_,uk_,idx_开头']
    }
  }
  let objCount = 0 // 对象计数
  try {
    // 如果有jsonObj 就优先这个
    conf = jsonObj || (file ? require(path.join(process.cwd(), file)).dbscan : require('./config').dbscan)
  } catch (e) {
    $.err(file ? 'Config format error！' : 'Config file missing!')
    process.exit(1)
  }
  conf.keyword = keyword
  db = require('j2sql')(conf.mysql)
  let t = Date.now()
  try {
    await waitNotEmpty(db, '_mysql', function (o) {
      if (Date.now() - t > 5000) {
        throw new Error('DB timeout!')
      }
    })
  } catch (e) {
    return 'DB timeout!'
  }

  console.log($.c.c(`===== start scan =====`))

  let dbObj = await getDB(conf)
  for (let i = 0; i < dbObj.length; i++) {
    let dbItem = dbObj[i]
    if (ifUppercase(dbItem)) {
      errGroup['Lev1']['0x20'].push(dbItem.fillStr(' ', 100))
    }
    if (ifKeyword(dbItem)) {
      errGroup['Lev1']['0x30'].push(dbItem.fillStr(' ', 100))
    }
    if (ifExcludeWord(dbItem)) {
      errGroup['Lev1']['0x40'].push(dbItem.fillStr(' ', 100))
    }
    if (ifHeadNum(dbItem)) {
      errGroup['Lev1']['0x50'].push(dbItem.fillStr(' ', 100))
    }
    if (ifUnderlineMany(dbItem)) {
      errGroup['Lev1']['0x60'].push(dbItem.fillStr(' ', 100))
    }
    if (ifHeadRearUnderline(dbItem)) {
      errGroup['Lev1']['0xB0'].push(dbItem.fillStr(' ', 100))
    }
    let tableObj = await getTable(dbItem)

    for (let k = 0; k < tableObj.length; k++) {
      let tableItem = tableObj[k]
      if (tableItem.comment.length < 1) {
        errGroup['Lev1']['0x10'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifUppercase(tableItem.name)) {
        errGroup['Lev1']['0x20'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifKeyword(tableItem.name)) {
        errGroup['Lev1']['0x30'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifExcludeWord(tableItem.name)) {
        errGroup['Lev1']['0x40'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifHeadNum(tableItem.name)) {
        errGroup['Lev1']['0x50'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifUnderlineMany(tableItem.name)) {
        errGroup['Lev1']['0x60'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifHeadRearUnderline(tableItem.name)) {
        errGroup['Lev1']['0xB0'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      if (ifPlural(tableItem.name)) {
        errGroup['Lev2']['0xC0'].push([dbItem, tableItem.name].join(' -> ').fillStr(' ', 100))
      }
      let fieldObj = await getField(dbItem, tableItem.name)
      for (let m = 0; m < fieldObj.length; m++) {
        let fieldItem = fieldObj[m]
        // $.log(fieldItem.Type)
        objCount++
        if (ifNoComment(fieldItem)) {
          errGroup['Lev1']['0x10'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifUppercase(fieldItem.Field)) {
          errGroup['Lev1']['0x20'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifKeyword(fieldItem.Field)) {
          errGroup['Lev1']['0x30'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifExcludeWord(fieldItem.Field)) {
          errGroup['Lev1']['0x40'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifHeadNum(fieldItem.Field)) {
          errGroup['Lev1']['0x50'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifUnderlineMany(fieldItem.Field)) {
          errGroup['Lev1']['0x60'].push([dbItem, tableItem.name, fieldItem.Field].join(' -> ').fillStr(' ', 100))
        }
        if (ifDecimal(fieldItem.Type)) {
          errGroup['Lev1']['0x70'].push([dbItem, tableItem.name, fieldItem.Field, fieldItem.Type].join(' -> ').fillStr(' ', 100))
        }
        if (fieldIncludeIs(fieldItem)) {
          errGroup['Lev1']['0x80'].push([dbItem, tableItem.name, fieldItem.Field, fieldItem.Type, fieldItem.Comment].join(' -> ').fillStr(' ', 100))
        }
        if (fieldEnum(fieldItem)) {
          errGroup['Lev1']['0x90'].push([dbItem, tableItem.name, fieldItem.Field, fieldItem.Type, fieldItem.Comment].join(' -> ').fillStr(' ', 100))
        }
        if (noDefaultValue(fieldItem)) {
          // $.dir(fieldItem)
          errGroup['Lev1']['0xA0'].push([dbItem, tableItem.name, fieldItem.Field, fieldItem.Type, fieldItem.Default || '[Null]'].join(' -> ').fillStr(' ', 100))
        }
        if (ifHeadRearUnderline(fieldItem.Field)) {
          errGroup['Lev1']['0xB0'].push([dbItem, tableItem.name, fieldItem.Field, fieldItem.Type].join(' -> ').fillStr(' ', 100))
        }
      }
    }
  }
  errGroup.Count = objCount + ' Objects scanned'

  if (!jsonObj) {
    $.dir(errGroup)
    process.exit(0)
  }
  db._mysql.pool.end(function (err) {
    console.log(err)
  })
  return errGroup
}

module.exports = { scan }
