'use strict';

const config = require('config');
const fs = require('fs');
const Sequelize = require('sequelize');
const log = require('log4js').getLogger();
const path = require('path');

const dbConfig = config.get('dbConfig');
const basename = path.basename(module.filename);
const db = {};

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  let vcap = JSON.parse(process.env.VCAP_SERVICES);
  dbConfig.databaseName = vcap.postgresql94[0].credentials.name;
  dbConfig.userName = vcap.postgresql94[0].credentials.username;
  dbConfig.password = vcap.postgresql94[0].credentials.password;
  dbConfig.host = vcap.postgresql94[0].credentials.host;
  dbConfig.port = vcap.postgresql94[0].credentials.port;
}

const sequelize = new Sequelize(dbConfig.databaseName, dbConfig.userName, dbConfig.password, {
  'host': dbConfig.host,
  'port': dbConfig.port,
  'dialect': 'mysql',
  'pool': {
    'max': 300,
    'min': 1,
    // Thrown when connection is not acquired due to timeout
    'acquire': 10000,
    // Remove a connection from the pool after the connection has been idle
    'idle': 1000,
    'handleDisconnects': true
  },
  'logging': false
});

// Import all models defined in this folder
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

/* Mapping on relationship between each tables */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    log.info('Connection to the database has been established successfully.');
  })
  .catch(err => {
    log.error('Unable to connect to the database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
