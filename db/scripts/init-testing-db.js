'use strict';

const pgtools = require('pgtools');

const config = {
  'user': 'assets360',
  'password': 'assets360',
  'port': 5432,
  'host': 'localhost'
};
pgtools.dropdb(config, 'assets360_test', (err, res) => {
  if (err) {
    console.error(err);
  }
  pgtools.createdb(config, 'assets360_test', (err, res) => {
    if (err) {
      process.exit(-1);
    }
  });
});
