# skyjt
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Downloads](https://img.shields.io/npm/dy/skyjt.svg?style=popout)](https://img.shields.io/npm/dy/skyjt.svg?style=popout)

### JiaTui Front group flash tools
* init ，i            													        初始化全栈工程结构

* jtjs ，jt            													        导出jt.js

* dbscan，db								JiaTui 数据库扫描规则 Default: 127.0.0.1/root/123456

* commentscan，comment								     加推前端函数注释扫描

* swaggerscan，swagger  [options] [option]		加推swagger规范扫描

* history                                 								      today history

* get [options]                           							      skyjt get -h url -p param

* post [options]                          						         skyjt post -h url -p param

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
