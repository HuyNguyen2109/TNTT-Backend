'use strict';

const log = require('log4js').getLogger();
const cryptoJS = require('crypto-js');
const fs = require('fs');

const resultDto = require('../common/dto/result');
const messageCodes = require('../common/message-codes');
const User = require('../models/user');
const Token = require('../models/token');


const registerUser = (req, res) => {
  const newUser = {
    'username': req.body.username,
    'password': '1',
    'email': req.body.email,
    'holyname': req.body.holyname,
    'fullname': req.body.fullname,
    'phone_number': req.body.phone_number,
    'birthday': req.body.birthday,
    'holy_birthday': req.body.holy_birthday,
    'type': req.body.type,
    'class': req.body.class,
    'avatar': '',
    'avatarMimeType': '',
    'avatarLocation': '',
  };

  return User
    .create(newUser)
    .then(result => {
      log.info(result);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const generateToken = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const data = {
    'username': username,
    'token': cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(username + '-' + password))
  };

  return Token
    .create(data)
    .then(result => {
      log.info(`Token created! ${result}`);
      res.sendSuccess(resultDto.success(messageCodes.I001, {
        'token': data.token
      }));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return User
    .findOne({ 'username': username })
    .lean()
    .then(result => {
      if (!result || result.password !== cryptoJS.AES.decrypt(password.toString(), username).toString(cryptoJS.enc.Utf8)) {
        throw resultDto.notFound(messageCodes.E004);
      } else {
        res.sendSuccess(resultDto.success(messageCodes.I001));
      }
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const updateUser = (req, res) => {
  const username = req.body.username;
  const updateUser = {
    'username': req.body.username,
    'content': req.body.content
  };
  // eslint-disable-next-line no-prototype-builtins
  if (updateUser.content.hasOwnProperty('password')) {
    // eslint-disable-next-line max-len
    updateUser.content.password = cryptoJS.AES.decrypt(updateUser.content.password.toString(), updateUser.username).toString(cryptoJS.enc.Utf8);
  }
  User
    .findOneAndUpdate({ 'username': username }, { '$set': updateUser.content })
    .then(() => {
      log.info('Received Data!!!');
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getUser = (req, res) => {
  const username = req.params.username;

  return User
    .findOne({ 'username': username })
    .lean()
    .then(result => {
      delete result.password;
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getUserByClassID = (req, res) => {
  const classID = req.params.classID;

  return User
    .find({ 'class': classID })
    .lean()
    .then(result => {
      delete result.password;
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
};

const getAllUsers = (req, res) => {
  return User
    .find({ 'username': { '$ne': 'root' } })
    .lean()
    .then(result => {
      delete result.password;
      res.sendSuccess(resultDto.success(messageCodes.I001, result));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const deleteMultipleUsernames = (req, res) => {
  const usernames = req.query.usernames;

  return User
    .deleteMany({ 'username': { '$in': usernames } })
    .then(o => {
      log.info(o);
      res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const uploadAvatar = (req, res) => {
  const imageFile = req.files[0];
  const username = req.params.username;

  const imageInformation = {
    'avatar': imageFile.originalname,
    'avatarMimeType': imageFile.mimeType || imageFile.mimetype,
    'avatarLocation': `${imageFile.path}`,
  }

  return User
    .findOne({ 'username': username })
    .then(o => {
      if (o.avatarLocation) {
        fs.unlinkSync(o.avatarLocation)
      }
      return User.findOneAndUpdate({ 'username': username }, { '$set': imageInformation })
    })
    .then(o => {
      if (o) res.sendSuccess(resultDto.success(messageCodes.I001))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const getAvatar = (req, res) => {
  const username = req.params.username;
  const defaultAvatarPath = 'datacenter/e33613d8fe367b4bb3e465dc166ebdde'
  const defaultAvatarMimeType = 'image/png';
  const defaultAvatarName = 'default-user.png';

  return User.findOne({ 'username': username })
    .then(data => {
      if (data.avatar !== null && data.avatarLocation !== '') {
        res.writeHead(200, {
          'Content-Type': data.avatarMimeType,
          'Content-disposition': `attachment; filename=${data.avatar}`,
        })
        let readFile = fs.createReadStream(data.avatarLocation)
        readFile.pipe(res)
      }
      else {
        res.writeHead(200, {
          'Content-Type': defaultAvatarMimeType,
          'Content-disposition': `attachment; filename=${defaultAvatarName}`,
        })
        let readFile = fs.createReadStream(defaultAvatarPath)
        readFile.pipe(res)
      }
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const deleteAvatar = (req, res) => {
  const username = req.params.username;

  return User.findOne({ username: username })
    .then(data => {
      fs.unlinkSync(data.avatarLocation)
      return User.findOneAndUpdate({ username: username }, {
        '$set': {
          avatar: '',
          avatarMimeType: '',
          avatarLocation: ''
        }
      })
    })
    .then(o => {
      if (o) res.sendSuccess(resultDto.success(messageCodes.I001))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    })
}

const pushNotificationByUsername = (req, res) => {
  const username = req.params.username;
  const notificationDetail = {
    'data': req.body.data,
    'timestamp': req.body.timestamp,
  }

  return User.findOneAndUpdate({ username: username }, {
    '$push': {
      notifications: notificationDetail
    }
  })
    .then((o) => {
      if(o) res.sendSuccess(resultDto.success(messageCodes.I001));
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const getNotificationByUsername = (req, res) => {
  const username = req.params.username;

  return User.findOne({ username: username })
    .then(data => {
      const notificationsArr = data.notifications;
      res.sendSuccess(resultDto.success(messageCodes.I001, notificationsArr))
    })
    .catch(err => {
      log.error(err);
      res.sendError(err);
    });
}

const clearAllNotificationByName = (req, res) => {
  const username = req.params.username;

  return User.findOneAndUpdate({username: username}, { '$set': { notifications: []}})
  .then((o) => {
    if(o) res.sendSuccess(resultDto.success(messageCodes.I001));
  })
  .catch(err => {
    log.error(err);
    res.sendError(err);
  });
}

module.exports = {
  'registerUser': registerUser,
  'login': login,
  'updateUser': updateUser,
  'getUser': getUser,
  'getUserByClassID': getUserByClassID,
  'generateToken': generateToken,
  'getAllUsers': getAllUsers,
  'deleteMultipleUsernames': deleteMultipleUsernames,
  'uploadAvatar': uploadAvatar,
  'getAvatar': getAvatar,
  'deleteAvatar': deleteAvatar,
  'pushNotificationByUsername': pushNotificationByUsername,
  'getNotificationByUsername': getNotificationByUsername,
  'clearAllNotificationByName': clearAllNotificationByName
};
