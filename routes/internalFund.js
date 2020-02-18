'use strict';

const express = require('express');
const router = express.Router();
const internalFundController = require('../controllers/internalFund');

router.get('/all', internalFundController.getAllFunds);

router.post('/new-fund', internalFundController.addFund);

router.post('/merge-fund', internalFundController.mergeAllFunds);

router.put('/update/:fundId', internalFundController.updateFund);

router.delete('/delete/:fundId', internalFundController.deleteFund);

module.exports = router;
