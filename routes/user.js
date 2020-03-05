'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.registerUser);

router.post('/login', userController.login);

router.post('/update', userController.updateUser);

router.get('/get-user/:username', userController.getUser);

router.get('/get-user-by-class/:classID', userController.getUserByClassID);

router.post('/token', userController.generateToken);

router.get('/all', userController.getAllUsers);

router.delete('/delete/by-usernames', userController.deleteMultipleUsernames),

router.post('/avatar/by-name/:username', userController.uploadAvatar);

router.get('/avatar/by-name/:username', userController.getAvatar);

router.delete('/avatar/by-name/:username', userController.deleteAvatar);

router.post('/notification/by-user/:username', userController.pushNotificationByUsername);

router.get('/notification/by-user/:username', userController.getNotificationByUsername);

router.delete('/notification/by-user/:username', userController.clearAllNotificationByName);

module.exports = router;
