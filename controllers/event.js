const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const Event = require('../models/event');
const log = require('log4js').getLogger();

const getAllEvents = (req, res) => {
	return Event
		.find({})
		.lean()
		.then(result => {
      res.sendSuccess(resultDto.success(messageCodes.I001, result))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const addNewEvent = (req, res) => {
	const newEvent = {
		'date': req.body.date,
		'content': req.body.content,
		'isChecked': false
	}

	return Event
		.create(newEvent)
		.then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const deleteCheckedEvents = (req, res) => {
	return Event
		.deleteMany({'isChecked': true})
		.then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const updateEventById = (req, res) => {
	const eventID = req.params.id;
	return Event
		.findOneAndUpdate({'_id': eventID}, {'$set':{'isChecked': true}})
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
	'getAllEvents': getAllEvents,
	'addNewEvent': addNewEvent,
	'deleteCheckedEvents': deleteCheckedEvents,
	'updateEventById': updateEventById
}