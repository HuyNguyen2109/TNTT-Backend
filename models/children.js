'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childrenScema = new Schema({
  'ID': Number,
  'firstname': String,
  'lastname': String,
  'father_name': String,
  'mother_name': String,
  'diocese': String,
  'male': String,
  'female': String,
  'class': String,
  'birthday': String,
  'day_of_Baptism': String,
  'day_of_Eucharist': String,
  'day_of_Confirmation': String,
  'address': String,
  'contact': String
});

const Children = mongoose.model('children', childrenScema, 'children');

module.exports = Children;
