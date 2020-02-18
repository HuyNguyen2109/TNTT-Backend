'use strict';

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/all', eventController.getAllEvents);

router.post('/new-event', eventController.addNewEvent);

router.delete('/delete-checked', eventController.deleteCheckedEvents);

router.post('/set-confirmed/:id', eventController.setConfirmedEvent);

router.put('/update/:id', eventController.updateEvent);

module.exports = router;
