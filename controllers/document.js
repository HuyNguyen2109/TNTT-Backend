const fs = require('fs');
const csv = require('csv-parser');
const log = require('log4js').getLogger();
const config = require('config');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Document = require('../models/document');

const createDocument = (req, res) => {
	const documentFile = req.files[0];
	const username = req.body.username;
	const createDate = req.body.date;

	const documentDetail = {
    'date': createDate,
    'modifiedDate': createDate,
		'filename': documentFile.originalname,
		'username': username,
    'key': `${documentFile.path}`,
    'type': documentFile.mimeType || documentFile.mimetype,
    'size': documentFile.size
  }

  return Document.findOne({ 'filename': documentDetail.filename })
    .then(doc => {
      if(doc) throw resultDto.conflict(messageCodes.E003)
      else return Document.create(documentDetail)
    })  
    .then(o => {
      log.info(o)

      res.sendSuccess(resultDto.success(messageCodes.I001))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
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
		.then(data => {
      if(data === null || data === undefined) {
        throw resultDto.notFound(messageCodes.E004);
      }
      log.info(`Remove file ${data.filename} from file server`)
      
      return fs.unlinkSync(data.key)
    })
    .then(() => {
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
      res.writeHead(200, {
        'Content-Type': `${doc.type}`,
        'Content-disposition': `attachment; filename=${doc.filename}`,
      });
      let readFile = fs.createReadStream(doc.key)
      readFile.pipe(res)
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const getDocumentById = (req, res) => {
  const docId = req.params.id;

  return Document.find({'_id': docId})
    .then(doc => {
      if(doc === null || doc === undefined) {
        throw resultDto.notFound(messageCodes.E004);
      }
      else res.sendSuccess(resultDto.success(messageCodes.I001, doc))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const renameDocumentById = (req, res) => {
  const docId = req.params.id;
  const renameDocument = {
    'filename': req.body.filename,
    'modifiedDate': req.body.modifiedDate
  }

  return Document.find({'_id': docId})
    .then(doc => {
      if(doc === null || doc === undefined) {
        throw resultDto.notFound(messageCodes.E004);
      }
      else return Document.findByIdAndUpdate({'_id': docId}, {'$set': renameDocument})
    })
    .then(o => {
      if(o) res.sendSuccess(resultDto.success(messageCodes.I001))
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
  'downloadById': downloadById,
  'getDocumentById': getDocumentById,
  'renameDocumentById': renameDocumentById
}