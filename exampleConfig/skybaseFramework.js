const path = require('path')
const dir = './_temp_jt_skybase/output-template/'

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
    model: {
      api: {
        skyapi: {
          'mock.js': [path.join(dir, 'model', 'api', 'skyapi', 'mock.js'), obj, 'mock接口定义'],
          'probe.js': [path.join(dir, 'model', 'api', 'skyapi', 'probe.js'), obj, 'mysql探针接口定义']
        }
      },
      'mock.js': [path.join(dir, 'model', 'mock.js'), obj, 'mock需要扩展的函数']
    },
    router: {
      'mysqlProbe.js': [path.join(dir, 'router', 'mysqlProbe.js'), obj, '探针Controller']
    },
    service: {
      'mysqlProbe.js': [path.join(dir, 'service', 'mysqlProbe.js'), obj, '探针Service']
    },
    template: {
      'grid-mysql.html': [path.join(dir, 'template', 'grid-mysql.html'), null, 'mysqlGrid探针'],
      'tree-mysql.html': [path.join(dir, 'template', 'tree-mysql.html'), null, 'mysqlTree探针'],
      'treemap-mysql.html': [path.join(dir, 'template', 'treemap-mysql.html'), null, 'mysqlTreemap探针']

    },
    tests: {},
    tools: {},
    sql: {},
    'README.md': [path.join(dir, 'README.md.tpl'), obj, 'README.md项目说明文件'],
    'package.json': [path.join(dir, 'package.json.tpl'), obj, 'package.json'],
    '.gitignore': [path.join(dir, '.gitignore'), obj, 'Git忽略文件列表'],
    '.editorconfig': [path.join(dir, '.editorconfig'), obj, 'editorconfig'],
    '.eslintignore': [path.join(dir, '.eslintignore'), obj, 'eslintignore'],
    '.istanbul.yml': [path.join(dir, '.istanbul.yml'), obj, 'istanbul'],
    'sonar-project.properties': [path.join(dir, 'sonar-project.properties.tpl'), obj, 'sonar扫描配置'],
    'index.js': [path.join(dir, 'index.js.tpl'), obj, '主启动文件'],
    '.gitlab-ci.yml': null,
    www: {}
  }
  return o
}
module.exports = genConfig
