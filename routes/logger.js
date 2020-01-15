'use strict';

const express = require('express');
const router = express.Router();
const logController = require('../controllers/logger');

router.get('/all/:type', logController.getAll);

router.delete('/clear', logController.clearAll);

module.exports = router;