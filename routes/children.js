'use strict';

const express = require('express');
const router = express.Router();
const childrenController = require('../controllers/children');

router.get('/all/:page', childrenController.WithPagination);

router.get('/count', childrenController.countDocument);

router.get('/export', childrenController.exportData);

router.post('/restore', childrenController.restoreData);

router.delete('/delete/by-names', childrenController.deleteByNames);

router.get('/by-name/:name', childrenController.getByName);

router.post('/update/by-name/:name', childrenController.updateByName);

router.post('/create', childrenController.createNew);

router.get('/grade/by-name/:name', childrenController.getGradeByName);

module.exports = router;
