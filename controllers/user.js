'use strict';

const log = require('log4js').getLogger();
const cryptoJS = require('crypto-js');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const User = require('../models/user');
const Token = require('../models/token');


const registerUser = (req, res) => {
  const newUser = {
    'username': req.body.username,
    'password': req.body.password,
    'email': req.body.email,
    'holyname': req.body.holyname,
    'fullname': req.body.fullname,
    'phone_number': req.body.phoneNumber, 
    'birthday': req.body.birthday,
    'holy_birthday': req.body.holyBirthday,
    'type': req.body.type,
    'class': req.body.class
  };

  return User
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

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return User
    .findOne({'username': username})
    .lean()
    .then(result => {
      if (!result || result.password !== cryptoJS.AES.decrypt(password.toString(), username).toString(cryptoJS.enc.Utf8)) {
        throw resultDto.notFound(messageCodes.E004);
      } else {
        const plainText = result.username + '-' + result.password;
        const tokenString = cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(plainText));
        const data = {
          'token': tokenString
        };

        Token
          .create(data)
          .then(result => {
            log.info(`Token created! ${result}`);
            res.sendSuccess(resultDto.success(messageCodes.I001, {
              'token': tokenString
            }));
          });
      }
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const updateUser = (req, res) => {
  const username = req.body.username;
  const updateUser = {
    'username': req.body.username,
    'content': req.body.content
  };
  if(updateUser.content.hasOwnProperty('password')) {
    updateUser.content.password = cryptoJS.AES.decrypt(updateUser.content.password.toString(), updateUser.username).toString(cryptoJS.enc.Utf8)
  }
  User
    .findOneAndUpdate({'username': username}, {'$set': updateUser.content})
    .then(result => {
      log.info(`Received Data!!!`);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getUser = (req, res) => {
  const username = req.params.username;
  
  return User
    .findOne({'username': username})
    .lean()
    .then(result => {
      delete result.password;
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

module.exports = {
  'registerUser': registerUser,
  'login': login,
  'updateUser': updateUser,
  'getUser': getUser
};
