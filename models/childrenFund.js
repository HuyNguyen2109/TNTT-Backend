'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childrenFundScema = new Schema({
  'date': String,
  'title': String,
  'price': Number
});

const ChildrenFund = mongoose.model('childrenFund', childrenFundScema, 'childrenFund');

module.exports = ChildrenFund;
