const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userRegexp = require('../regexp/user');
const bcrypt = require('bcrypt');

const saltRounds = 10; //加密强度
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
  nick_name: { type: String, required: true, },
  email: { type: String, required: true, },
  account: { type: String, required: true, },
  password: { type: String, required: true, },
  create_time: { type: Date, default: Date.now(), },
  last_login: { type: Date, default: Date.now(), },
  avatar: { type: String, default: '', },
  is_author: { type: Boolean, default: false, },
  mine_books: { type: [ObjectId], ref: 'Book', required: false, },
  like_books: { type: [ObjectId], ref: 'Book', default: [], },
  read_history: [
    {
      book_id: { type: ObjectId, required: true, ref: 'Book', },
      section_id: { type: ObjectId, required: true, ref: 'Section', },
    },
  ],
});

UserSchema.path('nick_name').validate(function (nick_name){
  return userRegexp.nickName.test(nick_name);
}, 'nick_name not conform to the regulation');
UserSchema.path('email').validate(function (email) {
  return userRegexp.email.test(email);
}, 'email not conform to the regulation');
UserSchema.path('account').validate(function (account) {
  return userRegexp.account.test(account);
}, 'account not conform to the regulation');

// 密码存储进数据库之前进行加盐加密
UserSchema.pre('save', function (next){
  const user = this;
  bcrypt.genSalt(saltRounds, function (err, salt){
    if (err){
      console.log(err);
      return next();
    }
    bcrypt.hash(user.password, salt, function (error, hash){
      if (error){
        console.log(error);
      }
      user.password = hash;
      return next();
    });
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;


