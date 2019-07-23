/**
 * @Author: {{d.username}}
 * @Date: {{d.time}}
 * @Name: {{d.name}}
 * @Desc: {{d.desc}}
 */
import { {{d.methods}} } from './toAxios'
import { isType, paramsCheck } from '@utils/base'
import { messageLayer } from '@utils/message'

export default {
{{# for(let i = 0; i< d.api.length;i++) { }}
  /** 
   * {{d.api[i].name}}
   * 业务参数 o {object} 接口入参
  {{# for(let j = 0; j < d.api[i].params.length; j++) { }}* @param {{d.api[i].params[j].name}} { {{d.api[i].params[j].type}} } {{ d.api[i].params[j].desc }} 默认值:{{d.api[i].params[j].def || '空'}} 是否必填:{{d.api[i].params[j].req}}
  {{# } }}
   * 配置参数 c {object} 配置 请在调用时配置
   */
  async {{d.api[i].funcName}}( o = {}, c = {}){
    const paramsRule = {{JSON.stringify(d.api[i].paramsRule)}}
    const checked = paramsCheck(isType(paramsRule, 'object') ? paramsRule : JSON.parse(paramsRule), o)
    if (checked) {
      messageLayer ? messageLayer(checked) : console.log(checked)
      return
    }
    return {{d.api[i].method}}Axios('{{d.api[i].url}}', o, c)
  }{{# if (i < d.api.length - 1) { }},{{# } }}
{{# } }}    
}