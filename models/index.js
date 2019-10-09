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
            const password = cryptoJS.AES.encrypt('1', username);

            let rootUser = {
              'username': username,
              'password': password,
              'fullname': 'Root User',
              'type': 'root'
            };
            User
              .create(rootUser)
              .then(result => {
                log.debug(result);
                log.info('Created/Re-created root user!');
              })
              .catch(err => {
                log.error(err);
              });
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
