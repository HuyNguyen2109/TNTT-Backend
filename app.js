'use strict';

const config = require('config');
const cors = require('cors');
const log4js = require('log4js');
const log4jsExtend = require('log4js-extend');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCode = require('http-status-codes');
const multer = require('multer');
const userRouter = require('./routes/user');

const resultDto = require('./common/dto/result');
const messageCodes = require('./common/message-codes');

const app = express();

// Set configuration for multer
const storage = multer.diskStorage({
  'destination': (req, file, cb) => {
    cb(null, 'public/uploads');
  }
});
const upload = multer({ 'storage': storage }).any();
app.use(cors());

app.use(bodyParser());
app.use(bodyParser.json({ 'limit': '50mb' }));
app.use(bodyParser.urlencoded({ 'limit': '50mb', 'extended': true }));

const BASE_URL = config.get('baseUrl');

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(BASE_URL + '/static', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'data')));

/* Load log4js configuration */
try {
  const logConfig = config.get('logConfig');
  log4js.configure(logConfig);
} catch (error) {
  throw error;
}

/* Use for format log file */
log4jsExtend(log4js, {
  'path': __dirname,
  'format': 'at @name (@file:@line:@column)'
});

/* Logger */
const log = log4js.getLogger();
log.debug('Starting server...!');

app.use((req, res, next) => {
  res.sendError = error => {
    log.error('Error before sending response: ', error);
    // Detect an error throw by Assets360 or default error message
    // eslint-disable-next-line no-prototype-builtins
    if (error && error.hasOwnProperty('httpCode')) {
      res.status(error.httpCode);
      delete error.httpCode;

      return res.send(error);
    }

    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(resultDto.internalServerError(messageCodes.E001));
  };

  res.sendSuccess = result => {
    delete result.httpCode;

    return res.send(result);
  };

  next();
});

app.use((req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      log.debug('Upload file failed. Error: ', err);

      return res.sendError(err);
    }
    next();
  });
});

app.use(function (req, res, next) {
  log.debug(' ==== Request information ==== ');
  log.debug('Original URL: ', req.originalUrl);
  log.debug('Method: ', req.method);
  log.debug('Path params: ', req.params);
  log.debug('Query params: ', req.query);
  log.debug(' ==== End request information ==== ');

  next();
});

// app.use(BASE_URL + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
//   'explorer': true
// }));

app.use(BASE_URL + '/user', userRouter);


/**
 * Catch 404 and forward to error handler
 */
app.use((req, res, next) => {
  const error = resultDto.notFound(messageCodes.E004);
  next(error);
});

app.use((err, req, res, next) => {
  if (err) {
    return res.sendError(err);
  }

  next();
});

/**
 * Handling uncaught exception
 */
process.on('uncaughtException', (error) => {
  log.debug('Catch uncaughtException event with error: ', error);
  // Shutdown log4js and kill process
  log4js.shutdown(() => {
    process.exit(1);
  });
});

module.exports = app;
