'use strict';

const express = require('express');
const router = express.Router();
const classController = require('../controllers/class');

router.get('', classController.getAll);

router.post('/create', classController.create);

router.get('/:classId', classController.getClassByClassId);

router.delete('/delete/:classId', classController.deleteClassByClassId);

module.exports = router;
