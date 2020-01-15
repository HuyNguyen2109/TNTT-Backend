const fs = require('fs');
const csv = require('csv-parser');
const log = require('log4js').getLogger();
const AWS = require("aws-sdk");
const config = require('config');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Document = require('../models/document');

const awsConfig = config.get('AWSConfig');
AWS.config.update({
  accessKeyId: awsConfig.accessKeyID,
  secretAccessKey: awsConfig.secretKeyID,
  region: 'ap-northeast-1',
  signatureVersion: 'v4'
})
const s3 = new AWS.S3();


const createDocument = (req, res) => {
	const documentFile = req.files[0];
	const username = req.body.username;
	const createDate = req.body.date;

  const bucketParam = {
    Bucket: awsConfig.S3BucketName,
    Body: fs.createReadStream(documentFile.path),
    Key: `${documentFile.originalname}`
  }
	
	const documentDetail = {
		'date': createDate,
		'filename': documentFile.originalname,
		'username': username,
		'key': `${documentFile.originalname}`
	}

  return s3.upload(bucketParam).promise()
    .then(o => {
      log.info(o);

      return Document.findOne({ 'filename': documentFile.originalname })
    })
    .then(doc => {
      if(doc !== null) {
        return Document.findOneAndUpdate({ 'filename': documentFile.originalname }, { '$set': { 'date': createDate } } )
      }
      else {
        return Document.create(documentDetail)
      }
    })
    .then(() =>{
      fs.unlink(documentFile.path, (err) => {})
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const getAllDocuments = (req, res) => {
	return Document.find({})
		.lean()
		.then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const deleteDocumentById = (req, res) => {
	const documentID = req.params.id;

	return Document.findOne({'_id': documentID}).lean()
		.then(data => {
      const bucketParam = {
        Bucket: awsConfig.S3BucketName,
        Key: data.filename
      }
      
      return s3.deleteObject(bucketParam).promise()
    })
    .then(o => {
      log.info(o);

      return Document.findOneAndDelete({ '_id': documentID })
    })
    .then((o) => {
      log.info(o)
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const downloadById = (req, res) => {
  const docID = req.params.id;

  return Document.findOne({ '_id': docID })
    .then(doc => {
      if(doc === null || doc === undefined) {
        throw resultDto.notFound(messageCodes.E004);
      }
      
      const bucketParam = {
        Bucket: awsConfig.S3BucketName,
        Key: doc.key,
      }

      return s3.getSignedUrlPromise('getObject', bucketParam);
    })
    .then(url => {
      res.sendSuccess(resultDto.success(messageCodes.I001, url));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

module.exports = {
	'createDocument': createDocument,
	'getAllDocuments': getAllDocuments,
	'deleteDocumentById': deleteDocumentById,
  'downloadById': downloadById
}