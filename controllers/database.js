const mongoose = require('mongoose');
const config = require('config');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const log = require('log4js').getLogger();

const backup = (req, res) => {
  const dbLocalConfig = config.get('dbConfigLocal');
  const connnectionString = `${dbLocalConfig.protocol}://${dbLocalConfig.server}/${dbLocalConfig.dbName}`;
  return mongoose.connect(connnectionString, {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false,
  })
  .then(client => {
    res.sendSuccess(resultDto.success(messageCodes.I001, client.models))
  })
}

module.exports = {
  'backup': backup
}