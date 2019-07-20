'use strict';

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const _ = require('lodash');
const log = require('log4js').getLogger();
const config = require('config');

const models = require('../db/models/index');
const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');

const userService = require('../services/user');

const saltRounds = 10;

const getAll = (req, res) => {
  return userService.getAllUser()
    .then((users) => {
      res.sendSuccess(resultDto.success(messageCodes.I005, users));
    })
    .catch((err) => {
      log.error('Cannot retreive users. Error: ', err)
      res.sendError(err);
    })
};

const create = (req, res) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(req.body.password, salt)
  const data = {
    'staffUserName': req.body.username,
    'staffPassword': hashPassword,
    'staffFullName': req.body.fullname,
    'staffPhoneNumber': req.body.phone,
    'staffBirthday': req.body.birthday,
    'staffPosition': req.body.postition
  };
  let transaction;

  return new Promise.resolve()
    .then(() => {
      return models.sequelize.transaction();
    })
    .then((t) => {
      transaction = t;
      
      return userService.createUSer(data, transaction);
    })
    .then(() => {
      return transaction.commit();
    })
    .then(() => {
      res.sendSuccess(resultDto.success(messageCodes.I004, {
        'message': 'User created successfully!'
      }));
    })
    .catch((err) => {
      transaction.rollback();
      log.error('Cannot create user. Error: ', err);
      res.sendError(err);
    })
    
};

module.exports = {
  'getAll': getAll,
  'create': create
};
