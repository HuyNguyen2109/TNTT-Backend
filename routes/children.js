'use strict';

const express = require('express');
const router = express.Router();
const childrenController = require('../controllers/children');

router.get('/all/:page', childrenController.WithPagination);

router.get('/count', childrenController.countDocument);

router.get('/export', childrenController.exportData);

router.post('/restore', childrenController.restoreData);

router.delete('/delete/by-name', childrenController.deleteByName);

router.delete('/delete/by-names', childrenController.deleteByNames);

module.exports = router;
