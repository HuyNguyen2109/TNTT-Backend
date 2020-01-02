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

const getByID = (req, res) => {
  const classID = req.params.id;

  return Class
    .find({'ID': classID})
    .then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const addNew = (req, res) => {
  const newClass = {
    'ID': req.body.ID,
    'Value': req.body.Value,
    'path': req.body.path
  }

  return Class
    .find({'ID': newClass.ID})
    .then(classRes => {
      if (classRes !== null) {
        throw resultDto.conflict(messageCodes.E003);
      }
      else {
        return Class.create(newClass)
      }
    })
    .then(res => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

module.exports = {
  'getAllClasses': getAllClasses,
  'getByPath': getByPath,
  'getByID': getByID,
  'addNew': addNew
};
