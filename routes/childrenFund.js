'use strict';

const express = require('express');
const router = express.Router();
const childrenFundController = require('../controllers/childrenFund');

router.get('/all', childrenFundController.getAllFunds);

router.post('/new-fund', childrenFundController.addFund);

router.post('/merge-fund', childrenFundController.mergeAllFunds);

module.exports = router;
