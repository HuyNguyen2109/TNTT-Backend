'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('', userController.getAll);

router.post('/create', userController.create);

module.exports = router;
