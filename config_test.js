const conf = {
  dbscan: {
    ver: '0.1.0',
    mysql: {
      port: 3306,
      pool: 1000,
      timeout: 500000,
      host: '172.16.0.39',
      user: 'root',
      password: 'jiatuidev@mysql3306',
      multipleStatements: true,
      connectionLimit: 1000,
      database: 'mysql'
    },
    excludeWord: ['-', '$', '%'],
    exDefaultType: ['time', 'text', 'binary', 'image', 'varbinary', 'sql_variant', 'uniqueidentifier'],
    excludePlural: ['goods', 'news', 'sys', 'class', 'means', 'glass', 'gas', 'maths', 'politics', 'physics', 'manners', 'links', 'address', 'press', 'works', 'status'],
    checkDB: ['order'],
    keyword: [
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
  }

}
module.exports = conf
