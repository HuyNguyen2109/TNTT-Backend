const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Class = require('../models/classes');

const getAllClasses = (req, res) => {
  return Class
  .find({})
  .lean()
  .then(result => {
    res.sendSuccess(resultDto.success(messageCodes.I001, result));
  })
  .catch(err => {
    log.error(err);
    res.sendError(err);
  });
};

const getByPath = (req, res) => {
  const pathname = req.query.path;

  return Class
    .find({'path': pathname})
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

module.exports = {
  'getAllClasses': getAllClasses,
  'getByPath': getByPath
};
