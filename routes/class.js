'use strict';

const express = require('express');
const router = express.Router();
const classController = require('../controllers/class');

router.get('/all', classController.getAllClasses);

router.get('/by-path', classController.getByPath);

router.get('/by-id/:id', classController.getByID);

router.post('/add', classController.addNew);

router.delete('/delete/by-id/:id', classController.deleteClassByID);

router.put('/update/:id', classController.updateById);

module.exports = router;
