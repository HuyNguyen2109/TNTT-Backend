'use strict';

const config = require('config');
const mongoose = require('mongoose');
const log = require('log4js').getLogger();
const cryptoJS = require('crypto-js');

const User = require('./user');

const clientConnect = () => {
  /* Connection for Mongodb Atlas */
  // const dbConfig = config.get('dbConfig');
  // eslint-disable-next-line max-len
  // const connectionString = `${dbConfig.protocol}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.dbType}?${dbConfig.option}`;
  // mongoose.connect(connectionString, {
  //   'useNewUrlParser': true,
  //   'useUnifiedTopology': true,
  //   'dbName': dbConfig.dbName
  // })
  //   .then(client => {
  //     log.debug(client.connection);
  //     log.info(`Connection to database ${dbConfig.dbName} has been established!`);
  //   })
  //   .catch(err => {
  //     log.error(`Error when connecting to datase: ${err}`);
  //   });

  /* Connection for Mongodb Local Database */
  const dbLocalConfig = config.get('dbConfigLocal');
  const connnectionString = `${dbLocalConfig.protocol}://${dbLocalConfig.server}/${dbLocalConfig.dbName}`;
  mongoose.connect(connnectionString, {
    'useNewUrlParser': true,
    'useUnifiedTopology': true
  })
    .then(client => {
      log.info(`Connection to database ${dbLocalConfig.dbName} has been established`);
      User
        .find({'username': 'root'})
        .then(username => {
          if(username.length === 0) {
            const username = 'root';
            const password = dbLocalConfig.defaultRootPassword;

            let rootUser = {
              'username': username,
              'password': password,
              'fullname': 'Root User',
              'type': 'root'
            };
            User
              .create(rootUser)
              .then(result => {
                log.info('Created/Re-created root user!');
              })
              .catch(err => {
                log.error(err);
              });

            // This below block-code is temporary for development purpose
            const adminUser = {
              "birthday" : "1996-09-21",
              "class" : "Bao Dong 1A",
              "fullname" : "Nguyen Nhut Huy",
              "holy_birthday" : "1996-06-29",
              "holyname" : "Phero",
              "password" : "111111",
              "phone_number" : "0389423079",
              "type" : "admin",
              "username" : "admin",
              "email" : "JohnasHuy2109@outlook.com"
            }
            User
              .create(adminUser)
              .then(result => {
                log.info('Created/Re-created admin user!');
              })
              .catch(err => {
                log.error(err);
              })
          }
        })
        .catch(error => {
          log.error(error);
        });
    })
    .catch(err => {
      log.error(`Error when connecting to database: ${err}`);
    });
};

module.exports = {
  'clientConnect': clientConnect
};
