'use strict';

const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/database');

router.get('/backup', databaseController.backup);

module.exports = router;