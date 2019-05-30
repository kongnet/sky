/**
 * @Author: Firmiana
 * @Date: 2019-04-07 12:09:39
 * @Last Modified by: Firmiana
 * @Last Modified time: 2019-04-24 14:46:20
 * @Desc: 用于自动检测接口定义规范
 * ✔ ✘ ❀ ㋡ ☹ ➢
 */

let $ = require('meeko')
let path = require('path')
// let conf
let reg = /(http|https):\/\/([\w.]+\/?)\S*/

const reqPromise = require('request-promise-native')
const utils = require('./tools/validata.js')

// get封装
async function checkJsonFunc (url) {
  try {
    return await reqPromise({
      method: 'GET',
      uri: url,
      json: true
    })
  } catch (e) {
    return false
  }
}

// 输出主函数  file = http链接 或者 配置文件
async function scan (file) {
  // conf = file || require('./config').swaggerscan.url
  let errGroup = {
    'lev0': '文件加载正确',
    'lev1': {
      '0x10': ['服务没有完整描述'],
      '0x20': ['接口基本描述不完整'],
      '0x30': ['接口入参描述不完整'],
      '0x40': ['不符合接口返回值规范']
    }
  }
  // console.log($.c.c(`===== start scan =====`))
  await checkDocs(errGroup, file)
  return errGroup
}
// 总检测
async function checkDocs (errGroup, url) {
  let checkJson
  if (!url) {
    checkJson = require('./data/api-docs.json')
  } else {
    if (reg.test(url)) {
      checkJson = await checkJsonFunc(url)
    } else {
      try {
        checkJson = require(path.join(process.cwd(), url))
      } catch (e) {
        // console.log($.c.r('swagger文件加载失败：无法获取目标url/file，请检查url/file是否正确'))
        // process.exit(1)
      }
    }
  }
  if (!checkJson) {
    // console.log($.c.r('swagger文件加载失败：无法获取目标url/file，请检查url/file是否正确'))
    // process.exit(1)
  } else if (typeof checkJson === 'string') {
    // console.log($.c.r('swagger文件加载失败：目标无法转为JSON，请检查JSON格式是否正确'))
    // process.exit(1)
  } else if (!checkJson.swagger) {
    // console.log($.c.r('swagger文件加载失败：目标未指明swagger版本，请检查是否swagger的JSON配置'))
    // process.exit(1)
  }
  checkHeader()
  await checkServFunc(checkJson.info, errGroup)
  await checkApiDescFunc(checkJson.paths, errGroup)
  await checkApiParamsFunc(checkJson.paths, checkJson.definitions, errGroup)
  await checkResFunc(checkJson.paths, checkJson.definitions, errGroup)
}

// 头部样式
function checkHeader () {
  // console.log('')
  // console.log('\x1b[45;37m', '   接口规范检测:', '\x1b[0m')
  // console.log('')
}

// 服务规范检测
async function checkServFunc (checkServData, errGroup) {
  let checkArr = []
  // console.log('\x1b[36m', '❀  服务描述检测', '\x1b[0m')
  if (checkServData) {
    // 服务中文名检测
    if (checkServData.title && (checkServData.title.trim()).length > 0) {
      if (utils.isValidChinese(checkServData.title)) {
        // console.log('\x1b[32m', '✔  服务存在中文名  --->  ' + `${checkServData.title}`, '\x1b[0m')
        checkArr.push(true)
      } else {
        // console.log('\x1b[31m', '✘  服务必须有中文名  --->  ' + `${checkServData.title}`, '\x1b[0m')
        checkArr.push(false)
        errGroup['lev1']['0x10'].push(`服务必须有中文名  --->  ${checkServData.title || null}`)
      }
    } else {
      // console.log('\x1b[31m', '✘  服务必须有中文名且不能为空  --->  ' + `${checkServData.title || null}`, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x10'].push(`服务必须有中文名且不能为空  --->  ${checkServData.title || null}`)
    }

    // 服务中文描述检测
    if (checkServData.description && (checkServData.description.trim()).length > 0) {
      if (utils.isValidChinese(checkServData.description)) {
        // console.log('\x1b[32m', '✔  服务存在中文描述  --->  ' + `${checkServData.description}`, '\x1b[0m')
        checkArr.push(true)
      } else {
        // console.log('\x1b[31m', '✘  服务必须有中文描述  --->  ' + `${checkServData.description || null}`, '\x1b[0m')
        checkArr.push(false)
        errGroup['lev1']['0x10'].push(`服务必须有中文描述  --->  ${checkServData.description || null}`)
      }
    } else {
      // console.log('\x1b[31m', '✘  服务必须有中文描述且不能为空  --->  ' + `${checkServData.description || null}`, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x10'].push(`服务必须有中文描述且不能为空  --->  ${checkServData.description || null}`)
    }

    // 服务联系人姓名检测
    if (checkServData.contact && checkServData.contact.name && (checkServData.contact.name.trim()).length > 0) {
      // console.log('\x1b[32m', '✔  服务存在联系人姓名  --->  ' + `${checkServData.contact.name}`, '\x1b[0m')
      checkArr.push(true)
    } else {
      const contactName = (checkServData.contact && checkServData.contact.name) || null
      // console.log('\x1b[31m', '✘  服务必须有联系人姓名且不能为空  --->  ' + `${contactName}`, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x10'].push(`服务必须有联系人姓名且不能为空  --->  ${contactName}`)
    }

    // 服务联系人邮箱检测
    if (checkServData.contact && checkServData.contact.email && (checkServData.contact.email.trim()).length > 0) {
      if (utils.validataEmail(checkServData.contact.email)) {
        // console.log('\x1b[32m', '✔  服务存在联系人邮箱  --->  ' + `${checkServData.contact.email}`, '\x1b[0m')
        checkArr.push(true)
      } else {
        // console.log('\x1b[31m', '✘  服务存在联系人邮箱异常  --->  ' + `${checkServData.contact.email || null}`, '\x1b[0m')
        checkArr.push(false)
        errGroup['lev1']['0x10'].push(`服务存在联系人邮箱异常  --->  ${checkServData.contact.email || null}`)
      }
    } else {
      // console.log('\x1b[31m', '✘  服务必须有联系人邮箱且不能为空  --->  ' + `${(checkServData.contact && checkServData.contact.email) || null}`, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x10'].push(`服务必须有联系人邮箱且不能为空  --->  ${null}`)
    }
  } else {
    // console.log('\x1b[31m', '✘  服务必须有完整描述才能继续检测', '\x1b[0m')
    checkArr.push(false)
  }
/*
  if (checkArr.length > 0 && checkArr.indexOf(false) === -1) {
    console.log('\x1b[34m', '㋡ 服务描述检测完全通过', '\x1b[0m')
  } else {
    console.log('\x1b[33m', '☹  服务描述检测未能完全通过', '\x1b[0m')
  }
  */
}

// 接口基本描述检测
async function checkApiDescFunc (checkApiDescData, errGroup) {
  let checkArr = []
  // console.log('\x1b[36m', '❀  接口基本描述检测', '\x1b[0m')
  for (let key in checkApiDescData) {
    if (checkApiDescData[key]['get']) {
      if (utils.isValidChinese(checkApiDescData[key]['get']['summary'])) {
        // console.log('\x1b[32m', `✔  接口[ GET  -> ${key} ]中存在中文介绍描述  --->  ` + `${checkApiDescData[key]['get']['summary'] || null}`, '\x1b[0m')
        checkArr.push(true)
      } else {
        // console.log('\x1b[31m', `✘  接口[ GET  -> ${key} ]中必须有中文介绍描述  --->  ` + `${checkApiDescData[key]['get']['summary'] || null}`, '\x1b[0m')
        checkArr.push(false)
        errGroup['lev1']['0x20'].push(`接口[ GET  -> ${key} ]中必须有中文介绍描述  --->  ${checkApiDescData[key]['get']['summary'] || null}`)
      }
    } else if (checkApiDescData[key]['post']) {
      if (utils.isValidChinese(checkApiDescData[key]['post']['summary'])) {
        // console.log('\x1b[32m', `✔  接口[ POST -> ${key} ]中存在中文介绍描述  --->  ` + `${checkApiDescData[key]['post']['summary'] || null}`, '\x1b[0m')
        checkArr.push(true)
      } else {
        // console.log('\x1b[31m', `✘  接口[ POST -> ${key} ]中必须有中文介绍描述  --->  ` + `${checkApiDescData[key]['post']['summary'] || null}`, '\x1b[0m')
        errGroup['lev1']['0x20'].push(`接口[ POST  -> ${key} ]中必须有中文介绍描述  --->  ${checkApiDescData[key]['post']['summary'] || null}`)
        checkArr.push(false)
      }
    } else {
      // console.log('\x1b[31m', `✘  接口[ ${key} ]不能为空  --->  ` + `${null}`, '\x1b[0m')
      errGroup['lev1']['0x20'].push(`接口[ ${key} ]不能为空  --->  ${null}`)
      checkArr.push(false)
    }
  }
  /*
  if (checkArr.length > 0 && checkArr.indexOf(false) === -1) {
    console.log('\x1b[34m', '㋡ 接口基本描述检测完全通过', '\x1b[0m')
  } else {
    console.log('\x1b[33m', '☹  接口基本描述检测未能完全通过', '\x1b[0m')
  }
  */
}

// 接口入参描述检测
async function checkApiParamsFunc (checkApiParamsData, checkDefinitionsData, errGroup) {
  let checkArr = []
  // console.log('\x1b[36m', '❀  接口入参描述检测', '\x1b[0m')

  for (let key in checkApiParamsData) {
    if (checkApiParamsData[key]['get'] && checkApiParamsData[key]['get']['parameters']) {
      // console.log('\x1b[37m', `➢  接口[ GET -> ${key} ]`, '\x1b[0m')
      checkApiParamsData[key]['get']['parameters'].map((item, index) => {
        if (item.name && (item.name.trim()).length > 0) {
          // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数名  --->  ` + `${item.name || null}`, '\x1b[0m')
          checkArr.push(true)
        } else {
          // console.log('\x1b[31m', `✘      参数${index + 1}.参数名不能为空  --->  ` + `${item.name || null}`, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET  -> ${key} ]参数${index + 1}参数名不能为空  --->  ${item.name || null}`)
        }
        if (item.type && item.type.length > 0) {
          // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数类型  --->  ` + `${item.type || null}`, '\x1b[0m')
          checkArr.push(true)
        } else {
          // console.log('\x1b[31m', `✘      参数${index + 1}.参数类型不能为空  --->  ` + `${item.type || null}`, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET  -> ${key} ]参数${index + 1}参数类型不能为空  --->  ${item.type || null}`)
        }
        if (item.description && (item.description.trim()).length > 0) {
          // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数描述  --->  ` + `${item.description || null}`, '\x1b[0m')
          checkArr.push(true)
        } else {
          // console.log('\x1b[31m', `✘      参数${index + 1}.参数描述不能为空  --->  ` + `${item.description || null}`, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET  -> ${key} ]参数${index + 1}参数描述不能为空  --->  ${item.description || null}`)
        }
        /*
        if (item.required) {
          console.log('\x1b[32m', `✔      参数${index + 1}.是否必填  --->  ` + `${item.required || null}`, '\x1b[0m')
        } else {
          console.log('\x1b[32m', `✔      参数${index + 1}.是否必填  --->  ` + `${item.required || false}`, '\x1b[0m')
        }
        if (item.example) {
          console.log('\x1b[32m', `✔      参数${index + 1}.存在示例  --->  ` + `${item.example || null}`, '\x1b[0m')
        } else {
          console.log('\x1b[32m', `✔      参数${index + 1}.不存在示例  --->  ` + `${item.example || null}`, '\x1b[0m')
        }
        */
      })
    } else if (checkApiParamsData[key]['post']) {
      // console.log('\x1b[37m', `➢  接口[ POST -> ${key} ]`, '\x1b[0m')
      checkApiParamsData[key]['post']['parameters'].map((item, index) => {
        if (item.schema && item.schema['$ref']) {
          item.schema['$ref'].split('/')
          let keyWord = item.schema['$ref'].split('/')[2]
          let eachKey = (checkDefinitionsData[keyWord] || {}).properties
          // let reqArr = checkDefinitionsData[keyWord].required
          for (let k in eachKey) {
            if (k && k.length > 0) {
              // console.log('\x1b[32m', `✔      存在参数名  --->  ` + `${k}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      参数名不能为空  --->  ` + `${k || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x30'].push(`接口[ POST  -> ${key} ]参数名不能为空  --->  ${k || null}`)
            }
            if (eachKey[k].type && eachKey[k].type.length > 0) {
              // console.log('\x1b[32m', `✔      参数[ ${k} ]存在参数类型  --->  ` + `${eachKey[k].type || null}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      参数[ ${k} ]的类型不能为空  --->  ` + `${eachKey[k].type || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x30'].push(`接口[ POST  -> ${key} ]中参数[ ${k} ]的类型不能为空  --->  ${eachKey[k].type || null}`)
            }
            if (eachKey[k].description && (eachKey[k].description.trim()).length > 0) {
              // console.log('\x1b[32m', `✔      参数[ ${k} ]存在参数描述  --->  ` + `${eachKey[k].description || null} `, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      参数[ ${k} ]的描述不能为空---> ` + `${eachKey[k].description || null} `, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]中参数[ ${k} ]的描述不能为空---> ${eachKey[k].description || null} `)
            }
            /*
            if (reqArr && reqArr.length > 0 && reqArr.indexOf(k) !== -1) {
              console.log('\x1b[32m', `✔      参数[ ${k} ]是否必填---> ` + `${true} `, '\x1b[0m')
            } else {
              console.log('\x1b[32m', `✔      参数[ ${k} ]是否必填---> ` + `${false} `, '\x1b[0m')
            }
            if (eachKey[k].example && eachKey[k].example.length > 0) {
              console.log('\x1b[32m', `✔      参数[ ${k} ]存在示例  --->  ` + `${eachKey[k].example || null} `, '\x1b[0m')
            } else {
              console.log('\x1b[32m', `✔      参数[ ${k} ]不存在示例 ---> ` + `${eachKey[k].example || null} `, '\x1b[0m')
            }
            */
          }
        } else {
          if (item.name && (item.name.trim()).length > 0) {
            // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数名---> ` + `${item.name || null} `, '\x1b[0m')
            checkArr.push(true)
          } else {
            // console.log('\x1b[31m', `✘      参数${index + 1}.参数名不能为空---> ` + `${item.name || null} `, '\x1b[0m')
            checkArr.push(false)
            errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]参数${index + 1} 参数名不能为空---> ${item.name || null} `)
          }
          if (item.type && item.type.length > 0) {
            // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数类型---> ` + `${item.type || null} `, '\x1b[0m')
            checkArr.push(true)
          } else {
            // console.log('\x1b[31m', `✘      参数${index + 1}.参数类型不能为空---> ` + `${item.type || null} `, '\x1b[0m')
            checkArr.push(false)
            errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]参数${index + 1} 参数类型不能为空---> ${item.type || null} `)
          }
          if (item.description && (item.description.trim()).length > 0) {
            // console.log('\x1b[32m', `✔      参数${index + 1}.存在参数描述---> ` + `${item.description || null} `, '\x1b[0m')
            checkArr.push(true)
          } else {
            // console.log('\x1b[31m', `✘      参数${index + 1}.参数描述不能为空---> ` + `${item.description || null} `, '\x1b[0m')
            checkArr.push(false)
            errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]参数${index + 1} 参数描述不能为空---> ${item.description || null} `)
          }
          if (item.required) {
            // console.log('\x1b[32m', `✔      参数${index + 1}.是否必填---> ` + `${item.required || null} `, '\x1b[0m')
          } else {
            // console.log('\x1b[32m', `✔      参数${index + 1}.是否必填---> ` + `${item.required || false} `, '\x1b[0m')
          }
          if (item.example) {
            // console.log('\x1b[32m', `✔      参数${index + 1}.存在示例  --->  ` + `${item.example || null}`, '\x1b[0m')
          } else {
            // console.log('\x1b[32m', `✔      参数${index + 1}.不存在示例  --->  ` + `${item.example || null}`, '\x1b[0m')
          }
        }
      })
    } else {
      // console.log('\x1b[31m', `✘  接口[ ${key} ]不能为空---> ` + `${null} `, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x30'].push(`接口[ ${key} ]不能为空---> ${null} `)
    }
  }

  if (checkArr.length > 0 && checkArr.indexOf(false) === -1) {
    // console.log('\x1b[34m', '㋡ 接口入参描述检测完全通过', '\x1b[0m')
  } else {
    // console.log('\x1b[33m', '☹  接口入参描述检测未能完全通过', '\x1b[0m')
  }

  // console.log('')
}

// 接口返回值规范检测
async function checkResFunc (checkApiResData, checkDefinitionsData, errGroup) {
  let checkArr = []
  // console.log('\x1b[36m', '❀  接口返回值规范检测', '\x1b[0m')

  for (let key in checkApiResData) {
    if (checkApiResData[key]['get']) {
      // console.log('\x1b[37m', `➢  接口[ GET -> ${key} ]`, '\x1b[0m')
      if (!checkApiResData[key]['get']['responses']['200']['schema'] || !checkApiResData[key]['get']['responses']['200']['schema']['$ref']) {
        checkArr.push(false)
        errGroup['lev1']['0x30'].push(`接口[ ${key} ]返回不能为空---> ${null} `)
      } else {
        let keyWord = checkApiResData[key]['get']['responses']['200']['schema']['$ref'].split('/')[2]
        let eachKey = checkDefinitionsData[keyWord].properties
        if (eachKey.code) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在返回码` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在返回码` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET -> ${key} ]返回码不能为空${' '} `)
        }
        if (eachKey.exts) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在扩展数据` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在扩展数据` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET -> ${key} ]扩展数据不能为空${' '} `)
        }
        if (eachKey.msg) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在返回信息` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在返回信息` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ GET -> ${key} ]返回信息不能为空${' '} `)
        }
        let resKeyword
        if (eachKey.data['$ref']) {
          checkArr.push(true)
          resKeyword = eachKey.data['$ref'].split('/')[2]
        } else if (eachKey.data['items']) {
          checkArr.push(true)
          resKeyword = eachKey.data['items']['$ref'].split('/')[2]
        } else {
          // console.log('\x1b[32m', `✔      返回值不存在返回数据` + `${' '} `, '\x1b[0m')
        }
        if (resKeyword) {
          let eachKeyRes = checkDefinitionsData[resKeyword].properties
          let reqArrRes = checkDefinitionsData[resKeyword].required
          for (let k in eachKeyRes) {
            if (k && k.length > 0) {
              // console.log('\x1b[37m', `➫      返回参数名  --->  ` + `${k}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `➫      返回参数名不能为空  --->  ` + `${k || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ GET  -> ${key} ]返回参数名不能为空  --->  ${k || null}`)
            }
            if (eachKeyRes[k].type && eachKeyRes[k].type.length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在返回参数类型  --->  ` + `${eachKeyRes[k].type || null}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      返回参数[ ${k} ]的类型不能为空  --->  ` + `${eachKeyRes[k].type || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ GET  -> ${key} ]中返回参数[ ${k} ]的类型不能为空  --->  ${eachKeyRes[k].type || null}`)
            }
            if (eachKeyRes[k].description && (eachKeyRes[k].description.trim()).length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在返回参数描述  --->  ` + `${eachKeyRes[k].description || null} `, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      返回参数[ ${k} ]的描述不能为空---> ` + `${eachKeyRes[k].description || null} `, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ GET -> ${key} ]中返回参数[ ${k} ]的描述不能为空---> ${eachKeyRes[k].description || null} `)
            }
            if (reqArrRes && reqArrRes.length > 0 && reqArrRes.indexOf(k) !== -1) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]是否必填---> ` + `${true} `, '\x1b[0m')
            } else {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]是否必填---> ` + `${false} `, '\x1b[0m')
            }
            if (eachKeyRes[k].example && eachKeyRes[k].example.length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在示例  --->  ` + `${eachKeyRes[k].example || null} `, '\x1b[0m')
            } else {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]不存在示例 ---> ` + `${eachKeyRes[k].example || null} `, '\x1b[0m')
            }
          }
        }
      }
    } else if (checkApiResData[key]['post']) {
      // console.log('\x1b[37m', `➢  接口[ POST -> ${key} ]`, '\x1b[0m')
      if (!checkApiResData[key]['post']['responses']['200']['schema'] || !checkApiResData[key]['post']['responses']['200']['schema']['$ref']) {
        checkArr.push(false)
        errGroup['lev1']['0x30'].push(`接口[ ${key} ]返回不能为空 ${null} `)
      } else {
        let keyWord = checkApiResData[key]['post']['responses']['200']['schema']['$ref'].split('/')[2]
        let eachKey = checkDefinitionsData[keyWord].properties
        if (eachKey.code) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在返回码` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在返回码` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]返回码不能为空${' '} `)
        }
        if (eachKey.exts) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在扩展数据` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在扩展数据` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]扩展数据不能为空${' '} `)
        }
        if (eachKey.msg) {
          checkArr.push(true)
          // console.log('\x1b[32m', `✔      返回值存在返回信息` + `${' '} `, '\x1b[0m')
        } else {
          // console.log('\x1b[31m', `✘      返回值不存在返回信息` + `${' '} `, '\x1b[0m')
          checkArr.push(false)
          errGroup['lev1']['0x30'].push(`接口[ POST -> ${key} ]返回信息不能为空${' '} `)
        }
        let resKeyword
        if (eachKey.data['$ref']) {
          checkArr.push(true)
          resKeyword = eachKey.data['$ref'].split('/')[2]
        } else if (eachKey.data['items']) {
          checkArr.push(true)
          resKeyword = eachKey.data['items']['$ref'].split('/')[2]
        } else {
          // console.log('\x1b[32m', `✔      返回值不存在返回数据` + `${' '} `, '\x1b[0m')
        }
        if (resKeyword) {
          let eachKeyRes = checkDefinitionsData[resKeyword].properties
          let reqArrRes = checkDefinitionsData[resKeyword].required
          for (let k in eachKeyRes) {
            if (k && k.length > 0) {
              // console.log('\x1b[37m', `➫      返回参数名  --->  ` + `${k}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `➫      返回参数名不能为空  --->  ` + `${k || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ POST  -> ${key} ]返回参数名不能为空  --->  ${k || null}`)
            }
            if (eachKeyRes[k].type && eachKeyRes[k].type.length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在返回参数类型  --->  ` + `${eachKeyRes[k].type || null}`, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      返回参数[ ${k} ]的类型不能为空  --->  ` + `${eachKeyRes[k].type || null}`, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ POST  -> ${key} ]中返回参数[ ${k} ]的类型不能为空  --->  ${eachKeyRes[k].type || null}`)
            }
            if (eachKeyRes[k].description && (eachKeyRes[k].description.trim()).length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在返回参数描述  --->  ` + `${eachKeyRes[k].description || null} `, '\x1b[0m')
              checkArr.push(true)
            } else {
              // console.log('\x1b[31m', `✘      返回参数[ ${k} ]的描述不能为空---> ` + `${eachKeyRes[k].description || null} `, '\x1b[0m')
              checkArr.push(false)
              errGroup['lev1']['0x40'].push(`接口[ POST -> ${key} ]中返回参数[ ${k} ]的描述不能为空---> ${eachKeyRes[k].description || null} `)
            }
            if (reqArrRes && reqArrRes.length > 0 && reqArrRes.indexOf(k) !== -1) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]是否必填---> ` + `${true} `, '\x1b[0m')
            } else {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]是否必填---> ` + `${false} `, '\x1b[0m')
            }
            if (eachKeyRes[k].example && eachKeyRes[k].example.length > 0) {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]存在示例  --->  ` + `${eachKeyRes[k].example || null} `, '\x1b[0m')
            } else {
              // console.log('\x1b[32m', `✔      返回参数[ ${k} ]不存在示例 ---> ` + `${eachKeyRes[k].example || null} `, '\x1b[0m')
            }
          }
        }
      }
    } else {
      // console.log('\x1b[31m', `✘  接口[${key} ]不能为空---> ` + `${null} `, '\x1b[0m')
      checkArr.push(false)
      errGroup['lev1']['0x30'].push(`接口[${key} ]不能为空---> ${null} `)
    }
  }
/*
  if (checkArr.length > 0 && checkArr.indexOf(false) === -1) {
    console.log('\x1b[34m', '㋡ 接口返回值规范检测完全通过', '\x1b[0m')
  } else {
    console.log('\x1b[33m', '☹  接口返回值规范检测未能完全通过', '\x1b[0m')
  }
*/
}

module.exports = {
  // checkDocs,
  // checkJsonFunc,
  scan
}
