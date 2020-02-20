const exec = require('child_process').exec;
const mongoose = require('mongoose');
const config = require('config');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const path = require('path');
const log = require('log4js').getLogger();
const moment = require('moment');

const automaticallyBackupPath = path.join(__dirname, '../backup/automatically');
const dbConfig = config.get('dbConfigLocal');

const backup = (basePath) => {
  if (fs.existsSync(basePath)) {
    exec('rm -rf ' + basePath, err => { });
  }
  let cmd = `mongodump --host ${dbConfig.server.split(':')[0]} --port ${dbConfig.server.split(':')[1]} --db ${dbConfig.dbName} --out ${basePath}`

  return exec(cmd, (error, stdout, stderr) => {
    if (error) return false
    else return stdout
  });
}

const autoBackup = () => {
  return new CronJob(
    '0 0 * * 0',
    () => {
      let isBackup = backup(automaticallyBackupPath);
      if (isBackup) log.info(`Automatic backup is generated successfully at ${Date()}`)
    },
    null,
    true,
    'Asia/Ho_Chi_Minh')
}

module.exports = {
  'backup': backup,
  'autoBackup': autoBackup,
}