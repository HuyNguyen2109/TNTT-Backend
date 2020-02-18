'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classesSchema = new Schema({
  'ID': String,
  'Value': String,
  'group': String,
  'path': String,
});

const Classes = mongoose.model('class', classesSchema, 'class');

module.exports = Classes;
