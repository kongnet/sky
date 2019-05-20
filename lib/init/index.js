const $ = require('meeko')
const gen = require('j2dir')
const fs = require('fs')
const path = require('path')
// 输出主函数
async function init (projectName, isForceCover) {
  let baseDir = [process.cwd()]
  let dirAry = fs.readdirSync(process.cwd())
  projectName = projectName || 'output'
  if (dirAry.includes(projectName) && !isForceCover) {
    $.err(`Project path ${$.c.r(projectName)} already exist!`)
    process.exit(1)
  }
  let inObj = {}
  inObj[projectName] = {
    config: {
      'index.js': null,
      'config.default.js': null,
      'config.dev.js': null,
      'config.test.js': null,
      'config.checkout.js': null,
      'config.prod.js': null
    },
    'job': {},
    'lib': {},
    'models': {},
    'router': {},
    'service': {},
    'tests': {},
    'tools': {},
    'sql': {},
    'README.md': null,
    '.gitignore': null,
    'sonar-project.properties': null,
    'nodemon.json': null,
    'index.js': null,
    '.gitlab-ci.yml': null,
    'www': {
      'build': {
        'webpack.base.config.js': null,
        'webpack.dev.config.js': null,
        'webpack.pre.config.js': null,
        'webpack.test.config.js': null,
        'webpack.pro.config.js': null
      },
      'dist': {},
      'src': {
        'api': {
          'api.js': null,
          'toAxios.js': null,
          'common.js': null,
          'view_api_xxx.js': null
        },
        'assert': {
          'images': {},
          'json': {},
          'stylus': {
            'base': {},
            'frame': {},
            'function': {},
            'minixs': {},
            'variable': {},
            'style.styl': null
          }

        },
        'views': {},
        'components': {
          'commons': {}
        },
        'router': {
          'index.js': null
        },
        'socket': {
          'index.js': null
        },
        'store': {
          'index.js': null,
          'modules': {},
          'actions.js': null,
          'getters.js': null,
          'layerState.js': null,
          'mutations.js': null,
          'mutations-types.js': null
        },
        'tools': {
          'bridge.js': null,
          'iscroll-lite': null,
          'iscroll-probe': null,
          'jtBridge': null,
          'method': null,
          'stat-h5': null,
          'utils': null
        },
        'index.html': null,
        'app.js': null,
        'App.vue': null,
        'StyleGuide.vue': null
      },
      '.babelrc': null,
      '.gitignore': [null, null, 'Git忽略文件列表'],
      '.gitlab-ci.yml': null,
      'webpack.config.js': null,
      'package.json': null,
      'README.md': null
    }
  }
  gen.genMain(inObj, baseDir, { 'templateDir': 'template' }) // 模板所在目录
  // gen.printDir(baseDir, outObj)
}
module.exports = {
  init
}
