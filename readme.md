# skyjt

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Downloads](https://img.shields.io/npm/dy/skyjt.svg?style=popout)](https://img.shields.io/npm/dy/skyjt.svg?style=popout)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkongnet%2Fsky.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkongnet%2Fsky?ref=badge_shield)

### JT Front group flash tools

- init ，i 初始化全栈工程结构
- init ，initmp 初始化小程序工程结构

- jtjs ，jt 导出 jt.js

- dbscan，db JiaTui 数据库扫描规则 Default: 127.0.0.1/root/123456

- commentscan，comment jt前端函数注释扫描

- swaggerscan，swagger [options][option] jt swagger 规范扫描

- history today history

- dict [word] skyjt dict sky 英文-中文字典查询

- get [options] skyjt get -h url -p param

- post [options] skyjt post -h url -p param

### Install node

[Download URL ](https://nodejs.org/en/download/current/)

### Install skyjt

```js
npm i -g skyjt
```

![comment](https://github.com/kongnet/sky/raw/master/screenShot/1.gif)

```js
skyjt init -n outputMP -t mp -f //在当前创建 outputMP目录 将 小程序模板 生成在其下，并强制覆盖 已有的文件
```

![comment](https://raw.githubusercontent.com/soekchl/sky/master/screenShot/skyjt_init_model.gif)

```js
skyjt init // 输入项目名称(默认output) 可选择增加 stat-统计，tools-工具包 模块 来创建项目
```

![comment](https://raw.githubusercontent.com/soekchl/sky/master/screenShot/qulityStat.gif)

```js
skyjt ccc -s // 扫描并统计项目错误
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkongnet%2Fsky.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkongnet%2Fsky?ref=badge_large)
