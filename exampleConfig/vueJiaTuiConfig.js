/*
├── build // 项目构建配置
│ ├── webpack.base.config.js // webpack 基础配置
│ ├── webpack.dev.config.js // 本地开发环境配置
│ ├── webpack.pre.config.js // pre 环境配置
│ ├── webpack.prod.config.js // 测试(test|checkout)环境配置
│ └── webpack.test.config.js // 生产环境配置
├── cli // 命令工具
├── config // 环境变量配置
├── dist // 构建后文件
├── docs // 自动生成文档
├── src
│ ├── api // 请求接口
│ │ ├── api.js // 所有接口汇总输出文件
│ │ ├── commons.js // 通用 api(如获取用户信息，发验证码等与模块无关接口)
│ │ └── toAxios.js // 基于 axios 封装的请求方法
│ ├── assets // 静态资源
│ │ ├── images
│ │ ├── less
│ │ └── svg
│ ├── components // 组件
│ │ ├── commons // 通用组件
│ │ └── layout // 布局组件
│ ├── directive // 指令
│ ├── mock // mock数据
│ ├── router // 路由
│ ├── store // vuex
│ ├── styles // 样式
│ ├── tools // 工具函数集合
│ ├── views // 视图
│ ├── app.js // 入口文件
│ ├── App.vue
│ └── index.html
├── jsconfig.json
├── package.json
├── README.md
*/
// TODO : 还未完成
const config = {
  ver: '0.1.0',
  build: {
    'webpack.base.config.js': [null, null, 'webpack 基础配置'],
    'config.default.js': null,
    'config.dev.js': null,
    'config.test.js': null,
    'config.checkout.js': null,
    'config.prod.js': null
  },
  job: {},
  lib: {},
  models: {},
  router: {},
  service: {},
  tests: {},
  tools: {},
  sql: {},
  'README.md': null,
  '.gitignore': null,
  'sonar-project.properties': null,
  'nodemon.json': null,
  'index.js': null,
  '.gitlab-ci.yml': null,
  www: {
    build: {
      'webpack.base.config.js': null,
      'webpack.dev.config.js': null,
      'webpack.pre.config.js': null,
      'webpack.test.config.js': null,
      'webpack.pro.config.js': null
    },
    dist: {},
    src: {
      api: {
        'api.js': null,
        'toAxios.js': null,
        'common.js': null,
        'view_api_xxx.js': null
      },
      assert: {
        images: {},
        json: {},
        stylus: {
          base: {},
          frame: {},
          function: {},
          minixs: {},
          variable: {},
          'style.styl': null
        }
      },
      views: {},
      components: {
        commons: {}
      },
      router: {
        'index.js': null
      },
      socket: {
        'index.js': null
      },
      store: {
        'index.js': null,
        modules: {},
        'actions.js': null,
        'getters.js': null,
        'layerState.js': null,
        'mutations.js': null,
        'mutations-types.js': null
      },
      tools: {
        'bridge.js': null,
        'iscroll-lite': null,
        'iscroll-probe': null,
        jtBridge: null,
        method: null,
        'stat-h5': null,
        utils: null
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
module.exports = config
