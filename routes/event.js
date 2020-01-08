'use strict';

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/all', eventController.getAllEvents);

router.post('/new-event', eventController.addNewEvent);

router.delete('/delete-checked', eventController.deleteCheckedEvents);

router.post('/update-by-id/:id', eventController.updateEventById)

module.exports = router;
