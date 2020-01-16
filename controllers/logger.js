const fs = require('fs')
const lineReader = require('line-reader');
const _ = require('lodash');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const log = require('log4js').getLogger();

const getAll = (req, res) => {
	const type = `[${req.params.type}]`;
	const logPath = './log/file.log';
	let filter = [];

	let text = fs.readFileSync(logPath).toString().split('\n')
	filter = text.filter(line => line.includes(type));
	res.sendSuccess(resultDto.success(messageCodes.I001, {
		logs: filter,
		legnth: filter.length,
		content: text
	}))
}

const clearAll = (req, res) => {
	const logPath = './log/file.log';
	fs.writeFile(logPath, '', (err, data) => {
		if(err) return res.sendError(err)
		else return res.sendSuccess(resultDto.success(messageCodes.I001))
	})
}

module.exports = {
	'getAll': getAll,
	'clearAll': clearAll
}