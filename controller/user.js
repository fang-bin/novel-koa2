const mongoose = require('mongoose');
const UserModel = require('../models/user');
const Api = require('./api');
const regexp = require('../regexp/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

class User extends Api {
  constructor() {
    super();
    this.hasUserRepeatParams = this.hasUserRepeatParams.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.signInUser = this.signInUser.bind(this);
    this.loginInUser = this.loginInUser.bind(this);
  }
  /**
   * @description 查找数据库中参数是否有重复的数据
   * 此方法中没有对 ctx.request.body 做校验，参数校验要放在具体的 api 接口中去处理
   * @author fangbin
   * @param {*} ctx
   * @param {*} next
   * @returns
   * @memberof User
   */
  async hasUserRepeatParams(ctx, next) {
    const {
      nick_name = '',
      email = '',
      account = '',
    } = ctx.request.body;
    let register = new Array();
    try {
      register = await Promise.all([UserModel.findOne({
        nick_name,
      }), UserModel.findOne({
        email,
      }), UserModel.findOne({
        account,
      })]);
    } catch (error) {
      console.log('验证注册用户参数是否重复失败', error.message);
      ctx.throw(500, '验证注册用户参数-服务端错误');
      return null;
    }
    return register.some(item => item);
  }

  /**
   * @description 验证注册用户信息是否重复
   * @author fangbin
   * @param {*} ctx
   * @param {*} next
   * @returns
   * @memberof User
   */
  async validateUser(ctx, next) {
    const validateSchema = Joi.object({
        nick_name: Joi.string().regex(regexp.nickName),
        email: Joi.string().regex(regexp.email),
        account: Joi.string().regex(regexp.account),
      }).length(1);
    const checkStatus = ctx.validate(ctx.request.body, validateSchema, false);
    if (!checkStatus) return undefined;
    const hasRepeatParams = await this.hasUserRepeatParams(ctx);
    if (hasRepeatParams === null) return undefined;
    if (hasRepeatParams){
      ctx.success(false, '参数重复');
    }else {
      ctx.success(true, '该数据可以使用');  //无重复信息
    }
  }
  /**
   * @description 用户注册
   * @author fangbin
   * @param {*} ctx
   * @param {*} next
   * @returns
   * @memberof User
   */
  async signInUser(ctx, next) {
    const checkStatus = ctx.validate(ctx.request.body, {
      nick_name: Joi.string().regex(regexp.nickName).required(),
      email: Joi.string().regex(regexp.email).required(),
      account: Joi.string().regex(regexp.account).required(),
      password: Joi.string().required(),
    });
    if (!checkStatus) return undefined;
    const {
      nick_name = '',
      email = '',
      account = '',
      password,
    } = ctx.request.body;
    const hasRepeatParams = await this.hasUserRepeatParams(ctx);
    if (hasRepeatParams === null) return undefined;
    if (hasRepeatParams){
      ctx.throw(400, {
        name: 'PARAMS_EXIST',
        message: '参数已注册',
      });
      return undefined;
    }
    try {
      await UserModel.create({
        nick_name,
        account,
        password,
        email,
      });
      ctx.success(true, '注册成功');
    } catch (error) {
      console.log('创建用户失败', error.message);
      ctx.throw(500, '创建用户失败');
    }
  }

  /**
   * @description 用户登录
   * @author fangbin
   * @param {*} ctx
   * @param {*} next
   * @returns
   * @memberof User
   */
  async loginInUser(ctx, next) {
    const checkStatus = ctx.validate(ctx.request.body, {
      account: Joi.string().regex(regexp.account).required(),
      password: Joi.string().required(),
    });
    if (!checkStatus) return undefined;
    const {
      account = '',
      password,
    } = ctx.request.body;
    const user = await UserModel.findOne({ account, });
    if (!user){
      ctx.throw(403, {
        name: 'NOT_USER',
        message: '用户不存在',
      });
      return undefined;
    }
    const dbPassword = user.password;
    const isMatch = await bcrypt.compare(password, dbPassword);
    if (isMatch){
      ctx.success(true, '登录成功');
    }else {
      ctx.throw(403, {
        name: 'PASSWORD_ERROR',
        message: '密码不正确',
      });
    }
  }

  // 修改密码，给邮箱发送验证码
  async sendCode(ctx, next) {
    const { email, } = ctx.request.body;
    try {
      if (!regexp.email.test(email)){
        throw new Error('email参数不符合规范');
      }
    } catch (error) {
      console.log('更改密码-输入的email参数不符合规范', error.message);
      ctx.body = this.fail(error.message, 'PARAMS_ERROR');
      return undefined;
    }
  }
}

module.exports = new User();