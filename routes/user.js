'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('', userController.getAll);

router.post('/create', userController.create);

router.get('/:username', userController.getUserByUsername);

router.put('/update/:username', userController.updateUserbyUsername);

module.exports = router;
