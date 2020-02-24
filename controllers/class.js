const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Class = require('../models/classes');
const log = require('log4js').getLogger();

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
  const classID = (req.params.id === "all")? "" : req.params.id;
  console.log(classID)

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
    'group': req.body.group,
    'path': req.body.path
  }

  return Class
    .find({'ID': newClass.ID})
    .then(classRes => {
      console.log(classRes)
      if (classRes.length !== 0) {
        throw resultDto.conflict(messageCodes.E003);
      }
      else {
        return Class.create(newClass)
      }
    })
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const deleteClassByID = (req, res) => {
  const classID = req.params.id;

  return Class
    .find({'ID': classID})
    .then(classRes => {
      if(classRes.length === 0) {
        throw resultDto.notFound(messageCodes.E004)
      }
      else {
        return Class.findOneAndDelete({'ID': classID})
      }
    })
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const updateById = (req, res) => {
  const classID = req.params.id;
  const classInformation = {
    'ID': req.body.ID,
    'Value': req.body.Value,
    'group': req.body.group,
    'path': req.body.path
  }

  return Class.findOne({'_id': classID})
    .then(res => {
      if(!res) throw resultDto.notFound(messageCodes.E004);
      else return Class.findOneAndUpdate({'_id': classID}, {'$set': classInformation})
    })
    .then(o => {
      if(o) res.sendSuccess(resultDto.success(messageCodes.I001))
    })
    .catch(err => {
      log.error(err)
      res.sendError(err);
    })
}

module.exports = {
  'getAllClasses': getAllClasses,
  'getByPath': getByPath,
  'getByID': getByID,
  'addNew': addNew,
  'deleteClassByID': deleteClassByID,
  'updateById': updateById
};
