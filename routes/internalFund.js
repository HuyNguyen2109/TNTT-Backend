'use strict';

const express = require('express');
const router = express.Router();
const internalFundController = require('../controllers/internalFund');

router.get('/all', internalFundController.getAllFunds);

router.post('/new-fund', internalFundController.addFund);

router.post('/merge-fund', internalFundController.mergeAllFunds);

module.exports = router;
