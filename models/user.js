const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  'username': String,
  'password': String,
  'email': String,
  'holyname': String,
  'fullname': String,
  'birthday': String,
  'holy_birthday': String,
  'type': String,
  'class': String
});

const Users = mongoose.model('user', userSchema, 'users');

module.exports = Users;
