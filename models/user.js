'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  'username': String,
  'password': String,
  'email': String,
  'holyname': String,
  'fullname': String,
  'phone_number': String,
  'birthday': String,
  'holy_birthday': String,
  'type': String,
  'class': String,
  'avatar': String,
  'avatarMimeType': String,
  'avatarLocation': String,
  'notifications': []
});

const Users = mongoose.model('user', userSchema, 'users');

module.exports = Users;
