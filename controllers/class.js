'use strict';

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const _ = require('lodash');
const log = require('log4js').getLogger();
const config = require('config');

const models = require('../db/models/index');
const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const requestor = require('../common/utils/requestor');

const classService = require('../services/class');

const getAll = (req, res) => {
  return classService.getAllClasses()
    .then((classes) => {
      res.sendSuccess(resultDto.success(messageCodes.I005, classes));
    })
    .catch((err) => {
      log.error('Cannot retreive classes. Error: ', err)
      res.sendError(err);
    })
};

const create = (req, res) => {
  const data = {
    'classId': req.body.classId,
    'className': req.body.className
  };
  let transaction;

  return models.sequelize.transaction()
    .then((t) => {
      transaction = t;

      return classService.createClass(data, transaction);
    })
    .then(() => {
      transaction.commit();
      res.sendSuccess(resultDto.success(messageCodes.I004, {
        'message': 'Class created successfully!'
      }));
    })
    .catch((err) => {
      log.error('Cannot create class. Error: ', err);
      res.sendError(err);
    });
};

const getClassByClassId = (req, res) => {
  const classId = req.params.classId;
  const conditions = {
    'classId': classId
  };
  const atttributes = ['className'];

  return classService.getClassByClassId(conditions, atttributes)
    .then((classes) => {
      res.sendSuccess(resultDto.success(messageCodes.I005, classes));
    })
    .catch((err) => {
      log.error('Can not retreive user. Error: ', err);
      res.sendError(err);
    });
}

const deleteClassByClassId = (req, res) => {
  const classId = req.params.classId;
  let transaction;
  const conditions = {
    'classId': classId
  };
  const atttributes = ['className'];

  return models.sequelize.transaction()
    .then((t) => {
      transaction = t;

      return classService.getClassByClassId(conditions, atttributes);
    })
    .then((classes) => {
      if(classes.length == 0) {
        throw resultDto.notFound(messageCodes.E004);
      }

      return classService.deleteClass(conditions, transaction);
    })
    .then(() => {
      transaction.commit();
      res.sendSuccess(resultDto.success(messageCodes.I004, {
        'message': 'Class deleted successfully!'
      }));
    })
    .catch((err) => {
      transaction.rollback();
      log.error('Can not delete class. Error: ', err);
      res.sendError(err);
    })
}

module.exports = {
  'getAll': getAll,
  'create': create,
  'getClassByClassId': getClassByClassId,
  'deleteClassByClassId': deleteClassByClassId
}