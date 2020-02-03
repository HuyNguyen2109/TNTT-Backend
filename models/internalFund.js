'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internalFundScema = new Schema({
  'date': String,
  'title': String,
  'price': Number
});

const InternalFund = mongoose.model('internalFund', internalFundScema, 'internalFund');

module.exports = InternalFund;
