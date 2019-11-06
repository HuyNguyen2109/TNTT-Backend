'use strict';

const express = require('express');
const router = express.Router();
const classController = require('../controllers/class');

router.get('/all', classController.getAllClasses);

module.exports = router;
