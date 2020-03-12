'use strict';

const config = require('config');
const mongoose = require('mongoose');
const log = require('log4js').getLogger();
const cryptoJS = require('crypto-js');

const User = require('./user');
const Class = require('./classes');

const clientConnect = () => {
  const dbLocalConfig = config.get('dbConfigLocal');
  const connnectionString = `${dbLocalConfig.protocol}://${dbLocalConfig.server}/${dbLocalConfig.dbName}`;
  mongoose.connect(connnectionString, {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false,
  })
    .then(client => {
      log.info(`Connection to database ${dbLocalConfig.dbName} has been established`);
      return User.find({ 'username': 'root' })
    })
    .then(username => {
      if (username.length === 0) {
        const username = 'root';
        const password = dbLocalConfig.defaultRootPassword;

        let rootUser = {
          'username': username,
          'password': password,
          'fullname': 'Root User',
          'type': 'root',
          'avatar': '',
          'avatarLocation': '',
          'avatarMimeType': '',
        };
        return User.create(rootUser);
      }
    })
    .then(result => {
      log.info('Created/Re-created root user!');
      return Class.deleteMany({})
    })
    .then(result => {
      log.info('Resetted!')
      return Class.create([{
        'ID': "",
        'Value': 'Chung',
        'path': '/dashboard/all',
      }, {
        'ID': 'CC',
        'Value': 'Chiên Con',
        'path': '/dashboard/CC',
        'group': 'Ấu'
      }, {
        'ID': 'BD1A',
        'Value': 'Bao Đồng 1A',
        'path': '/dashboard/BD1A',
        'group': 'Thiếu'
      }])
    })
    .then(result => {
      log.info('Created/Re-created class!');
    })
    .catch(err => {
      log.error(`Error when connecting to database: ${err}`);
    });
};

module.exports = {
  'clientConnect': clientConnect,
};
