const express = require('express');
const router = express.Router();
const weatherQueryController = require('../models/weatherQueries');

//all work

// Count of tornadoes with high death toll
router.get('/death-toll-tornadoes', async (req, res, next) => {
  try {
    await weatherQueryController.countHighDeathTollTornadoes(req, res);
  } catch (error) {
    next(error);
  }
});

// Hailstone sizes for specific death toll ranges
router.get('/hailstone-sizes', async (req, res, next) => {
  try {
    await weatherQueryController.hailstoneSizesForDeathToll(req, res);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err); // Log the error for server-side debugging
  res.status(500).json({ message: 'An internal error occurred' });
});

module.exports = router;
