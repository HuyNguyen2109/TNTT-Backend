const moment = require('moment');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const InternalFund = require('../models/internalFund');
const log = require('log4js').getLogger();

const getAllFunds = (req, res) => {
  return InternalFund
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

  return InternalFund
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

const mergeAllFunds = (req, res) => {
  let total = 0;

  return InternalFund
    .find({})
    .lean()
    .then(funds => {
      funds.forEach(fund => {
        total += Number(fund.price)
      })

      return InternalFund.deleteMany({})
    })
    .then((o)=> {
      log.info(o)
      const mergedFund = {
        'date': moment().format('YYYY-MM-DD'),
        'title': `Quỹ Thiếu nhi tính đến ngày ${moment().format('DD/MM/YYYY')}`,
        'price': total
      }

      return InternalFund.create(mergedFund)
    })
    .then((o) => {
      log.info(o)
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err)
    })
}

const updateFund = (req, res) => {
  const fundId = req.params.fundId
  const fundInformation = {
    'date': req.body.date,
    'title': req.body.title,
    'price': req.body.price
  }

  return InternalFund.findOne({'_id': fundId})
    .then(res => {
      if(!res) throw resultDto.notFound(messageCodes.E004);
      else return InternalFund.findOneAndUpdate({'_id': fundId}, {'$set': fundInformation})
    })
    .then(o => {
      if(o) res.sendSuccess(resultDto.success(messageCodes.I001))
    })
    .catch(err => {
      log.error(err)
      res.sendError(err);
    })
}

const deleteFund = (req, res) => {
  const fundId = req.params.fundId;

  return InternalFund.deleteOne({_id: fundId})
    .then(o =>{
      if(o) res.sendSuccess(resultDto.success(messageCodes.I001)); 
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

module.exports = {
  'getAllFunds': getAllFunds,
  'addFund': addFund,
  'mergeAllFunds': mergeAllFunds,
  'updateFund': updateFund,
  'deleteFund': deleteFund
};
