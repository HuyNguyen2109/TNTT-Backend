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

const addFund = (req, res) => {
  const newFund = {
    'date': req.body.date,
    'title': req.body.title,
    'price': req.body.price
  }

  return ChildrenFund
    .create(newFund)
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

module.exports = {
  'getAllFunds': getAllFunds,
  'addFund': addFund
};
