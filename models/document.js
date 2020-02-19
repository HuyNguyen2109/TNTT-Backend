'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  'date': String,
  'modifiedDate': String,
  'filename': String,
  'username': String,
  'key': String,
  'type': String,
  'size': String,
});

const Document = mongoose.model('document', documentSchema, 'document');

module.exports = Document;
