'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  'username': String,
  'token': String
})

const Token = mongoose.model('token', tokenSchema, 'tokens');

module.exports = Token;
