/* eslint-disable no-prototype-builtins */
'use strict';

const log4js = require ('log4js');
const log4jsExtend = require ('log4js-extend');
const express = require ('express');
const cors = require('cors');
const bodyParser = require ('body-parser');
const httpStatusCodes = require ('http-status-codes');
const multer = require('multer');

const resultDto = require ('./common/dto/result');
const messageCodes = require ('./common/message-codes');

const mongoDB = require ('./models/index');
const demoRouter = require ('./routes/demo');
const emailRouter = require ('./routes/email');
const userRouter = require('./routes/user');
const childrenRouter = require('./routes/children');
const classRouter = require('./routes/class');
const childrenFundRouter = require('./routes/childrenFund');
const internalFundRouter = require('./routes/internalFund');
const eventRouter = require('./routes/event');
const documentRouter = require('./routes/document');
const logRouter = require('./routes/logger');
const databaseRouter = require('./routes/database');
const backupEngine = require('./models/backup');

const config = require('config');
const app = express();

mongoDB.clientConnect();
backupEngine.autoBackup();

const storage = multer.diskStorage({
  'destination': (req, file, cb) => {
    cb(null, 'datacenter');
  }
});

const upload = multer({'storage': storage, limits: { fileSize: 10*1024*1024 }}).any();

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

const BASE_URL = config.get('baseURL');
const port = config.get('applicationPort');

// Load log4js configuration
// eslint-disable-next-line no-useless-catch
try {
  const logConfig = config.get('logConfig');
  log4js.configure(logConfig);
} catch (err) {
  throw err;
}

// Using format log file
log4jsExtend(log4js, {
  'path': __dirname,
  'format': 'at @name (@file:@line:@column)'
});

// Logger
const log = log4js.getLogger();
log.debug('Starting server...!');

app.use((req, res, next) => {
  res.sendError = error => {
    log.error('Error before sending response: ', error);
    if(error && error.hasOwnProperty('httpCode')) {
      res.status(error.httpCode);
      delete error.httpCode;

      return res.send(error);
    }

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(resultDto.internalServerError(messageCodes.E001));
  };

  res.sendSuccess = result => {
    delete result.httpCode;

    return res.send(result);
  };

  next();
});

app.use((req, res, next) => {
  log.debug(' ==== Request information ==== ');
  log.debug('Original URL: ', req.originalUrl);
  log.debug('Method: ', req.method);
  log.debug('Path params: ', req.params);
  log.debug('Query params: ', req.query);
  log.debug(' ==== End request information ==== ');

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

app.use(BASE_URL + '/demo', demoRouter);
app.use(BASE_URL + '/email', emailRouter);
app.use(BASE_URL + '/user', userRouter);
app.use(BASE_URL + '/children', childrenRouter);
app.use(BASE_URL + '/class', classRouter);
app.use(BASE_URL + '/children-fund', childrenFundRouter);
app.use(BASE_URL + '/internal-fund', internalFundRouter);
app.use(BASE_URL + '/event', eventRouter);
app.use(BASE_URL + '/document', documentRouter);
app.use(BASE_URL + '/log', logRouter);
app.use(BASE_URL + '/database', databaseRouter);

// Catch 404 error
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

app.listen(port, () => {
  log.info(`Server is running on port: ${port}`);
});
