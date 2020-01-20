const mongoose = require('mongoose');
const UserModel = require('../models/user');
const Api = require('./api');
const regexp = require('../regexp/user');
const bcrypt = require('bcrypt');

class User extends Api {
  constructor() {
    super();
    this.hasUserRepeatParams = this.hasUserRepeatParams.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.signInUser = this.signInUser.bind(this);
    this.loginInUser = this.loginInUser.bind(this);
  }
  // 查找数据库中参数是否有重复的数据
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
      ctx.body = this.fail('验证失败', 'ERROR');
      return null;
    }
    return register.some(item => item);
  }

  // 验证注册用户信息是否重复
  async validateUser(ctx, next) {
    const {
      nick_name,
      email,
      account,
    } = ctx.request.body;
    try {
      if (nick_name && !regexp.nickName.test(nick_name)){
        throw new Error('nick_name参数不符合规范');
      }else if (email && !regexp.email.test(email)){
        throw new Error('email参数不符合规范');
      }else if (account && !regexp.account.test(account)){
        throw new Error('account参数不符合规范');
      }
    } catch (error) {
      console.log('验证注册用户参数是否重复错误', error.message);
      ctx.body = this.fail(error.message, 'PARAMS_ERROR');
      return undefined;
    }
    const hasRepeatParams = await this.hasUserRepeatParams(ctx);
    if (hasRepeatParams === null) return undefined;
    if (hasRepeatParams){
      ctx.body = this.success(false);  //有重复信息
    }else {
      ctx.body = this.success(true);  //无重复信息
    }
  }
  async signInUser(ctx, next) {
    const {
      nick_name = '',
      email = '',
      account = '',
      password,
    } = ctx.request.body;
    try {
      if (nick_name && !regexp.nickName.test(nick_name)) {
        throw new Error('nick_name参数不符合规范');
      } else if (email && !regexp.email.test(email)) {
        throw new Error('email参数不符合规范');
      } else if (account && !regexp.account.test(account)) {
        throw new Error('account参数不符合规范');
      }else if (!password){
        throw new Error('缺少password');
      }
    } catch (error) {
      console.log('注册用户参数错误', error.message);
      ctx.body = this.fail(error.message, 'PARAMS_ERROR');
      return undefined;
    }
    const hasRepeatParams = await this.hasUserRepeatParams(ctx);
    if (hasRepeatParams === null) return undefined;
    if (hasRepeatParams){
      ctx.body = this.fail('参数有重复', 'PARAMS_REPEAT');
      return undefined;
    }
    try {
      await UserModel.create({
        nick_name,
        account,
        password,
        email,
      });
      ctx.body = this.success(true);
    } catch (error) {
      console.log('创建用户失败', error.message);
      ctx.body = this.fail(error.message, 'CREATE_USER_FAIL');
    }
  }

  // 用户登录
  async loginInUser(ctx, next) {
    const {
      account = '',
      password,
    } = ctx.request.body;
    try {
      if (!regexp.account.test(account)){
        throw new Error('nick_name参数不符合规范');
      }else if (!password){
        throw new Error('缺少password');
      }
    } catch (error) {
      console.log('登录用户信息不符合规范或缺少参数', error.message);
      ctx.body = this.fail(error.message, 'PARAMS_ERROR');
      return undefined;
    }
    const user = await UserModel.findOne({ account, });
    if (!user){
      ctx.body = this.fail('该用户还未注册，请先注册!', 'NOT_REGISTER');
      return undefined;
    }
    const dbPassword = user.password;
    const isMatch = await bcrypt.compare(password, dbPassword);
    if (isMatch){
      ctx.body = this.success(true);
    }else {
      ctx.body = this.fail('密码不正确', 'PASSWORD_ERROR');
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