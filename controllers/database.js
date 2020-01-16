const mongoose = require('mongoose');
const config = require('config');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const log = require('log4js').getLogger();

const backup = (req, res) => {
  return res.sendSuccess(resultDto.success(messageCodes.I001))
}

module.exports = {
  'backup': backup
}