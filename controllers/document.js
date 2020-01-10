const fs = require('fs');
const csv = require('csv-parser');
const log = require('log4js').getLogger();
const { google } = require('googleapis');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Document = require('../models/document');

const createDocument = (req, res) => {
	const documentFile = req.files[0];
	const username = req.body.username;
	const createDate = req.body.date;
	
	const documentDetail = {
		'date': createDate,
		'filename': documentFile.originalname,
		'username': username,
		'url': documentFile.path
	}

	return Document.create(documentDetail)
		.then(o => {
      log.info(o);
      fs.unlinkSync(documentFile.path);
    })
    .then(() => {
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

	return Document.findOneAndDelete({'_id': documentID})
		.then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

module.exports = {
	'createDocument': createDocument,
	'getAllDocuments': getAllDocuments,
	'deleteDocumentById': deleteDocumentById,
  'listFiles': listFiles
}