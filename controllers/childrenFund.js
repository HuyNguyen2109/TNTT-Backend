const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const ChildrenFund = require('../models/childrenFund');
const log = require('log4js').getLogger();

const getAllFunds = (req, res) => {
  return ChildrenFund
    .find({})
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

module.exports = {
  'getAllFund': getAllFunds
};
