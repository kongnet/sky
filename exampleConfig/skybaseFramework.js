const path = require('path')
const dir = './_temp_jt_skybase/'

function genConfig (obj) {
  let o = {
    config: {
      'index.js': [path.join(dir, 'config', 'index.js'), obj, '配置加载文件'],
      'config.default.js': [path.join(dir, 'config', 'config.default.js'), obj, '默认环境配置'],
      'config.dev.js': [path.join(dir, 'config', 'config.dev.js'), obj, '开发环境配置'],
      'config.test.js': [path.join(dir, 'config', 'config.test.js'), obj, '测试环境配置'],
      'config.prod.js': [path.join(dir, 'config', 'config.prod.js'), obj, '生产配置']
    },
    job: {},
    lib: {},
    middleware: {
      'sample-middleware.js': [path.join(dir, 'middleware', 'sample-middleware.js'), obj, '中间件例子'],
      'README.md': [path.join(dir, 'middleware', 'README.md'), obj, 'middleware帮助文件']
    },
    model: {
      api: {
        skyapi: {
          'mock.js': [path.join(dir, 'model', 'api', 'skyapi', 'mock.js'), obj, 'mock接口定义'],
          'probe.js': [path.join(dir, 'model', 'api', 'skyapi', 'probe.js'), obj, 'mysql探针接口定义'],
          'sky-stat.js': [path.join(dir, 'model', 'api', 'skyapi', 'sky-stat.js'), obj, '接口统计定义']
        }
      },
      'mock.js': [path.join(dir, 'model', 'mock.js'), obj, 'mock需要扩展的函数'],
      'crud.js': [path.join(dir, 'model', 'crud.js'), obj, '数据库crud扩展'],
      'sky-stat': {
        'htmlOut.js': [path.join(dir, 'model', 'sky-stat', 'htmlOut.js'), obj, '统计输出模板类']
      }
    },
    router: {
      'mysqlProbe.js': [path.join(dir, 'router', 'mysqlProbe.js'), obj, '探针Controller'],
      'sky-stat': {
        'stat.js': [path.join(dir, 'router', 'sky-stat', 'stat.js'), obj, '统计router']
      },
      'mock': {
        'img.js': [path.join(dir, 'router', 'mock', 'img.js'), obj, '统计router']
      }
    },
    service: {
      'mysqlProbe.js': [path.join(dir, 'service', 'mysqlProbe.js'), obj, '探针Service'],
      'sky-stat': {
        'stat.js': [path.join(dir, 'service', 'sky-stat', 'stat.js'), obj, '统计service']
      }
    },
    template: {
      'grid-mysql.html': [path.join(dir, 'template', 'grid-mysql.html'), null, 'mysqlGrid探针'],
      'tree-mysql.html': [path.join(dir, 'template', 'tree-mysql.html'), null, 'mysqlTree探针'],
      'treemap-mysql.html': [path.join(dir, 'template', 'treemap-mysql.html'), null, 'mysqlTreemap探针']

    },
    tests: {},
    tool: {
      'mocha_api_test.js': [path.join(dir, 'tool', 'mocha_api_test.js'), obj, 'mocha无参数提交测试api接口'],
      'scanNoParam.js': [path.join(dir, 'tool', 'scanNoParam.js'), obj, '无参数测试运行js']
    },
    sql: {},
    'README.md': [path.join(dir, 'README.md.tpl'), obj, 'README.md项目说明文件'],
    'README_stat.md': [path.join(dir, 'README_stat.md'), obj, 'README_stat.md项目说明文件'],
    'package.json': [path.join(dir, 'package.json.tpl'), obj, 'package.json'],
    '.gitignore': [path.join(dir, '.gitignore'), obj, 'Git忽略文件列表'],
    '.editorconfig': [path.join(dir, '.editorconfig'), obj, 'editorconfig'],
    '.eslintignore': [path.join(dir, '.eslintignore'), obj, 'eslintignore'],
    '.istanbul.yml': [path.join(dir, '.istanbul.yml'), obj, 'istanbul'],
    'sonar-project.properties': [path.join(dir, 'sonar-project.properties.tpl'), obj, 'sonar扫描配置'],
    'index.js': [path.join(dir, 'index.js.tpl'), obj, '主启动文件'],
    'index_stat.js': [path.join(dir, 'index_stat.js.tpl'), obj, '统计主启动文件'],
    'skyconfig.js': [path.join(dir, 'skyconfig.js'), obj, 'skybase主动配置文件'],
    '.gitlab-ci.yml': null,
    www: {}
  }
  return o
}
module.exports = genConfig
