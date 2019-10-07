'use strict';
const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const nodeMailer = require('nodemailer');
const config = require('config');
const log4js = require('log4js');

const log = log4js.getLogger();
const emailConfig = config.get('emailConfig');

const sendEmail = (req, res) => {
  const transporter = nodeMailer.createTransport({
    'host': 'smtp.gmail.com',
    'port': 465,
    'secure': true,
    'auth': {
      'user': emailConfig.username,
      'pass': emailConfig.password
    }
  });

  const mailOptions = {
    'from': `${req.body.email}`,
    'to': `${emailConfig.username}`,
    'subject': `${req.body.subject}`,
    'text': req.body.text
  };

  log.info(mailOptions);

  return transporter.sendMail(mailOptions)
    .then((info) => {
      log.info(`Email sent! Id: ${info.messageId}`);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch((err) => {
      log.error(`Error when sending email: ${err}`);
      res.sendError(err);
    });
};

module.exports = {
  'sendEmail': sendEmail
};
