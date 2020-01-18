const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  nick_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  create_time: {
    type: Date,
    default: Date.now(),
  },
  last_login: {
    type: Date,
    default: Date.now(),
  },
  avatar: {
    type: String,
    default: '',
  },
});


