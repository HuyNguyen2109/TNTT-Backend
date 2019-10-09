'use strict';

const log = require('log4js').getLogger();
const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const User = require('../models/user');

const registerUser = (req, res) => {
  let newUser = {
    'username': req.body.username,
    'password': req.body.password,
    'email': req.body.email,
    'holyname': req.body.holyname,
    'fullname': req.body.fullname,
    'birthday': req.body.birthday,
    'holy_birthday': req.body.holyBirthday,
    'type': req.body.type,
    'class': req.body.class
  };

  User
    .create(newUser)
    .then(result => {
      log.info(result);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

module.exports = {
  'registerUser': registerUser
};
