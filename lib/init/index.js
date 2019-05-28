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
  let mp = { // 小程序规范和目录
    config: {
      'index.js': [null, null, '环境配置文件入口'],
      'config.default.js': [null, null, '默认配置'],
      'config.dev.js': [null, null, '开发环境配置'],
      'config.test.js': [null, null, '测试环境配置'],
      'config.checkout.js': [null, null, '测试环境2'],
      'config.prod.js': [null, null, '正式环境']
    },
    'README.md': [null, null, '帮助文件'],
    'app.js': [null, null, '全局入口'],
    'app.wxss': [null, null, '全局样式'],
    'app.json': [null, null, '全局配置'],
    'sitemap.json': [null, null, '站点映射'],
    '.gitignore': [null, null, 'Git忽略文件列表'],
    'package.json': [null, null, 'node模块支持'],
    'components': {
      'README.md': [null, null, '组件帮助文件'],

      'commons': {// 公共组件
      }
    },
    'pages': {
      'README.md': [null, null, '各页面说明文件']

    },
    'assert': {
      'images': {},
      'audio': {},
      'font': {}
    },
    'api': {// 每个页面的api
    },
    'lib': {// 自有成熟库
    },
    'http': {// http相关
      'http.js': [null, null, 'http请求的分装'],
      'mock.js': [null, null, 'mock数据'],
      'mock-data': {// 本地mock数据
      }
    },
    'utils': {
      'README.md': [null, null, '工具帮助文件'],
      'tools': {// 更多的工具汇总
      },
      'wxTools.js': null, // 微信封装能力
      'util.js': null
    },
    'packageA': {// 分包异步加载
      'README.md': [null, null, '分包帮助文件']

    },
    'moduleA': {// 业务相对独立，不用每次下载 多个独立分包 微信客户端 6.7.2，基础库 2.3.0 及以上版本开始支持。开发者工具请使用 1.02.1808300 及以上版本
      'README.md': [null, null, '独立分包帮助文件']

    }
    // package_x or  module_x <=2M   total package_x + module_x<=8M
  }
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
