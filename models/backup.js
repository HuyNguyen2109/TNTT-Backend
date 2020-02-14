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

const addFundForNextMonth = () => {
  return new CronJob(
    '59 23 * * *',
    () => {
      if (moment().format('DD/MM/YYYY') === moment().endOf('month').format('DD/MM/YYYY')) {
        let total = 0;
        ChildrenFund
          .find({})
          .lean()
          .then(funds => {
            funds.forEach(fund => {
              total += Number(fund.price)
            })

            const fundforNewMonth = {
              'date': moment().add(1, 'months').format('YYYY-MM-DD'),
              'title': `Quỹ Thiếu nhi ${moment().add(1, 'months').format('YYYY-MM-DD')}`,
              'price': total
            }

            return ChildrenFund.create(fundforNewMonth)
          })
          .then((o) => {
            if(o) log.info('Fund Added!')
          })
          .catch(err => {
            log.error(err)
          });
        
          InternalFund
          .find({})
          .lean()
          .then(funds => {
            funds.forEach(fund => {
              total += Number(fund.price)
            })

            const fundforNewMonth = {
              'date': moment().add(1, 'months').format('YYYY-MM-DD'),
              'title': `Quỹ Thiếu nhi ${moment().add(1, 'months').format('YYYY-MM-DD')}`,
              'price': total
            }

            return InternalFund.create(fundforNewMonth)
          })
          .then((o) => {
            if(o) log.info('Fund Added!')
          })
          .catch(err => {
            log.error(err)
          })
      }
    },
    null,
    true,
    'Asia/Ho_Chi_Minh')
}

module.exports = {
  'backup': backup,
  'autoBackup': autoBackup,
  'addFundForNextMonth': addFundForNextMonth
}