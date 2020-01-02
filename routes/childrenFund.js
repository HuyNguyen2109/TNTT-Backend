'use strict';

const express = require('express');
const router = express.Router();
const childrenFundController = require('../controllers/childrenFund');

router.get('/all', childrenFundController.getAllFunds);

module.exports = router;
