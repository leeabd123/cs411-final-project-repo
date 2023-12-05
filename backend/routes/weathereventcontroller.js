const express = require('express');
const router = express.Router();
const weatherEventController = require('../models/weatherEventController.js');

// Route to get weather events by month
router.get('/:month', weatherEventController.getWeatherEventsByMonth);

module.exports = router;
