const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const log = require('log4js').getLogger();
const path = require('path')
const config = require('config')
const fs = require('fs')
const exec = require('child_process').exec;
const util = require('util');

//for Tummblr configuration
var tumblrConfig = config.get('tumblrConfig');
var tumblr = require('tumblr.js');
var tumblrClient = tumblr.createClient({
  consumer_key: tumblrConfig.consumerKey,
  consumer_secret: tumblrConfig.consumerSecret,
  token: tumblrConfig.token,
  token_secret: tumblrConfig.tokenSecret
}); 

const automaticallyBackupPath = path.join(__dirname, '../backup/automatically')
const manuallybackupPath = path.join(__dirname, '../backup/manually')
const backupEngine = require('../models/backup');
const dbConfig = config.get('dbConfigLocal');

const checkBackupExist = (req, res) => {
  if(fs.existsSync(path.join(manuallybackupPath, dbConfig.dbName)) || fs.existsSync(path.join(automaticallyBackupPath, dbConfig.dbName))) {
    res.sendSuccess(resultDto.success(messageCodes.I001, true))
  }
  else {
    throw resultDto.notFound(messageCodes.E004);
  }
} 

const manuallyBackup = (req, res) => {
  let result = backupEngine.backup(manuallybackupPath)
  if(result !== false) {
    res.sendSuccess(resultDto.success(messageCodes.I001, true));
  }
  else {
    res.sendError(result);
  }
}

const deleteManuallyBackup = (req, res) => {
  if(fs.existsSync(path.join(manuallybackupPath, dbConfig.dbName))) {
    exec('rm -rf ' + path.join(manuallybackupPath, dbConfig.dbName), err => {});
    return res.sendSuccess(resultDto.success(messageCodes.I001));
  }
  else{
    throw resultDto.notFound(messageCodes.E004);
  }
}

const getTumblrImage = (req, res) => {
  const tumblrCustomPromise = util.promisify(tumblrClient.blogPosts)
  let detail = {};
  return tumblrCustomPromise(tumblrConfig.blogNameForImage)
    .then(data => {
      let slideshowData = data.posts.filter(o => {return o.slug.indexOf('slideshow') > -1})
      detail.img = slideshowData[0].photos[0].original_size.url;
      detail.url = config.get('tumblrConfig').blogNameForImage;
      return tumblrCustomPromise(tumblrConfig.blogNameForGospel)
    })
    .then(data => {
      detail.content = data.posts[0].caption.substring(0, data.posts[0].caption.indexOf('Gospel (USA)'))
      res.sendSuccess(resultDto.success(messageCodes.I001, detail))
    })
    .catch(err => {
      return res.sendError(err)
    })
}

module.exports = {
  'checkBackupExist': checkBackupExist,
  'manuallyBackup': manuallyBackup,
  'deleteManuallyBackup': deleteManuallyBackup,
  'getTumblrImage': getTumblrImage
}