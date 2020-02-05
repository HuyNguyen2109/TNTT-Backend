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

router.post('/grade/new/by-name/:name', childrenController.addGradeByName);

router.post('/grade/update/by-name/:name', childrenController.updateGradeByName);

router.post('/grade/delete/by-name/:name', childrenController.deleteGradeByName);

router.get('/absent/by-name/:name', childrenController.getAbsentByName);

router.post('/absent/new/by-name/:name', childrenController.addAbsentByName);

router.post('/absent/update/by-name/:name', childrenController.updateAbsentByName);

router.post('/absent/delete/by-name/:name', childrenController.deleteAbsentByName);

router.post('/lock-scores', childrenController.lockScoreBySemester);

router.delete('/reset-scores/:classID', childrenController.resetScores);

module.exports = router;
