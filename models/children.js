'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childrenScema = new Schema({
  'ID': String,
  'name': String,
  'father_name': String,
  'mother_name': String,
  'diocese': String,
  'male': String,
  'female': String,
  'class': String,
  'birthday': String,
  'day_of_baptism': String,
  'day_of_eucharist': String,
  'day_of_confirmation': String,
  'address': String,
  'contact': String,
  'grades': [],
  'absents': [],
  'scoreI': String,
  'scoreII': String,
  'finalScore': String,
  'note': String,
});

const Children = mongoose.model('children', childrenScema, 'children');

module.exports = Children;
