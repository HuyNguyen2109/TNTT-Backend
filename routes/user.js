'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.registerUser);

router.post('/login', userController.login);

router.post('/update', userController.updateUser);

router.get('/get-user/:username', userController.getUser);

router.post('/token', userController.generateToken);

module.exports = router;
