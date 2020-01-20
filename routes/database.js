'use strict';

const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/database');

router.get('/check-exist', databaseController.checkBackupExist);

router.get('/backup', databaseController.manuallyBackup);

router.delete('/backup/delete-manually', databaseController.deleteManuallyBackup);

router.get('/tumblr/posts', databaseController.getTumblrImage);

module.exports = router;