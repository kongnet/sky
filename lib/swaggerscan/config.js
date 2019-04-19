const defaultData = require('./data/json/api-docs.json')

const conf = {
  swaggerscan: {
    ver: '0.1.0',
    desc: '默认Json数据',
    dataJson: defaultData,
    dataUrl: 'http://msr.jiatuidev.com/ai-article/v2/api-docs',
    url: './data/json/api-docs.json'
  }

}
module.exports = conf