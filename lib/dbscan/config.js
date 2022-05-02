const conf = {
  dbscan: {
    ver: '0.1.0',
    desc: '数据库规范扫描,参看阿里java泰山版',
    mysql: {
      port: 3306,
      pool: 1000,
      timeout: 500000,
      host: '127.0.0.1',
      user: 'root',
      password: '123456',
      multipleStatements: true,
      connectionLimit: 1000,
      database: 'mysql'
    },
    excludeWord: ['-', '$', '%'],
    exDefaultType: [
      'time',
      'text',
      'binary',
      'image',
      'varbinary',
      'sql_variant',
      'uniqueidentifier'
    ],
    excludePlural: [
      'goods',
      'news',
      'sys',
      'class',
      'means',
      'glass',
      'gas',
      'logs',
      'maths',
      'politics',
      'physics',
      'manners',
      'links',
      'address',
      'press',
      'works',
      'status',
      'stats',
      'business',
      'bussiness',
      'statistics'
    ],
    checkDB: ['mysql']
  }
}
module.exports = conf
