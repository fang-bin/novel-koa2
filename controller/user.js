const mongoose = require('mongoose');
const UserModel = require('../models/user');
const Api = require('./api');
class User extends Api {
  constructor() {
    super();
  }
  // 添加用户
  async addUser (params) {
    const {
      nick_name,
      email,
      account,
      password,
    } = params;
    
  }
}