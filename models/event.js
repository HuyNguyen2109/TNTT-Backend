'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  'date': String,
  'content': String,
  'isChecked': Boolean
});

const Event = mongoose.model('event', eventSchema, 'event');

module.exports = Event;
