const Joi = require('joi');

/**
 * @description 校验参数
 * @param {*} [params={}] 被校验的参数
 * @param {*} [schema={}] 校验规则
 * @param {boolean} [mode=true] 模式，默认自由模式
 * @return boolean
 */
function validate (params = {}, schema = {}, mode = true) {
  const ctx = this;
  let validator = null;
  if (mode){
    validator = Joi.validate(params, Joi.object().keys(schema), { allowUnknown: true, });
  }else {
    validator = Joi.validate(params, schema, { allowUnknown: true, });
  }
  if (validator.error) {
    ctx.throw(400, {
      message: validator.error.message,
      name: 'PARAMS_NOT_CONFORM',
    })
    return false;
  }
  return true;
}

/**
 * @description 成功返回
 * @author fangbin
 * @param {*} [data={}] 返回的数据
 * @param {string} [message='成功'] 返回的信息
 */
function success (data = {}, message = '成功'){
  const ctx = this;
  ctx.body = {
    status: 200,
    data,
    message,
    name: 'SUCCESS',
  };
}

module.exports = {
  validate: validate,
  success: success,
}