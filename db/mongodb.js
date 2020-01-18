const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

const db = mongoose.connection;

const connect = function (callback){
  db.on('error', err => {
    console.log(err);
  })
    .on('disconnected', connect)
    .once('open', () => {
      console.log('数据库链接成功');
      typeof(callback) === 'function' && callback();
    });
  return mongoose.connect(config.dbUrl, {
    keepAlive: 1,
  });
}

module.exports = connect;