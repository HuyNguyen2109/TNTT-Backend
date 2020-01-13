'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  'date': String,
  'filename': String,
  'username': String,
  'key': String,
});

const Document = mongoose.model('document', documentSchema, 'document');

module.exports = Document;
