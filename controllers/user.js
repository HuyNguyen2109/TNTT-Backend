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
  const data = {
    'staffUserName': req.body.username,
    'staffPassword': req.body.password,
    'staffFullName': req.body.fullname,
    'staffPhoneNumber': req.body.phone,
    'staffBirthday': req.body.birthday,
    'staffHolyBirthday': req.body.holyBirthday,
    'staffPosition': req.body.position
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
    }); 
};

const getUserByUsername = (req, res) => {
  const username = req.params.username;
  const conditions = {
    'staffUserName': username
  }
  const attributes = ['staffFullName', 'staffPhoneNumber', 'staffBirthday', 'staffHolyBirthday', 'staffPosition', 'isFirstTimeLogin']; 

  return userService.getUserByUsername(conditions, attributes)
    .then((user) => {
      res.sendSuccess(resultDto.success(messageCodes.I005, user));
    })
    .catch((err) => {
      log.error('Can not retreive user. Error: ', err);
      res.sendError(err);
    });
};

const updateUserbyUsername = (req, res) => {
  const username = req.params.username;
  const conditions = {
    'staffUserName': username
  };
  const data = {
    'staffPassword': req.body.password,
    'staffFullName': req.body.fullname,
    'staffPhoneNumber': req.body.phone,
    'staffBirthday': req.body.birthday,
    'staffPosition': req.body.position
  };
  let transaction;
  const attributes = ['staffFullName', 'staffPhoneNumber', 'staffBirthday', 'staffHolyBirthday', 'staffPosition', 'isFirstTimeLogin'];

  return models.sequelize.transaction()
  .then((t) => {
    transaction = t;

    return userService.getUserByUsername(conditions, attributes);
  })
  .then((users) => {
    if(users.length == 0) {
      throw resultDto.notFound(messageCodes.E004)
    }

    return userService.updateUserbyUsername(data, conditions, transaction);
  })
  .then(() => {
    transaction.commit();
    res.sendSuccess(resultDto.success(messageCodes.I004, {
      'message': 'User updated successfully!'
    }));
  })
  .catch((err) => {
    transaction.rollback();
    log.error('Can not update user. Error: ', err);
    res.sendError(err);
  });
};

const deleteUserByUsername = (req, res) => {
  const username = req.params.username;
  let transaction;
  const conditions = {
    'staffUserName': username
  }
  const attributes = ['staffFullName', 'staffPhoneNumber', 'staffBirthday', 'staffHolyBirthday', 'staffPosition', 'isFirstTimeLogin']; 

  return models.sequelize.transaction()
    .then((t) => {
      transaction = t;
  
      return userService.getUserByUsername(conditions, attributes); 
    })
    .then((users) => {
      if(users.length == 0) {
        throw resultDto.notFound(messageCodes.E004);
      }
  
      return userService.deleteUser(conditions, transaction);
    })
    .then(() => {
      transaction.commit();
      res.sendSuccess(resultDto.success(messageCodes.I004, {
        'message': 'User deleted successfully!'
      }));
    })
    .catch((err) => {
      transaction.rollback();
      log.error('Can not delete user. Error: ', err);
      res.sendError(err);
    });
}

module.exports = {
  'getAll': getAll,
  'create': create,
  'getUserByUsername': getUserByUsername,
  'updateUserbyUsername': updateUserbyUsername,
  'deleteUserByUsername': deleteUserByUsername
};
