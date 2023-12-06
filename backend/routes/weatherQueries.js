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

// Endpoint to fetch hail event details
router.get('/hail/:eventId', async (req, res, next) => {
  try {
      // SQL query to join WeatherEvent, Category, and Hail tables
      const query = `
          SELECT 
              WeatherEvent.*, 
              Category.category_name, 
              Hail.temperature, 
              Hail.hailstone_size, 
              Hail.fall_speed 
          FROM 
              WeatherEvent 
          JOIN 
              Category ON WeatherEvent.category_id = Category.category_id 
          JOIN 
              Hail ON WeatherEvent.event_id = Hail.event_id 
          WHERE 
              WeatherEvent.event_id = ?;
      `;

      // Execute the query with the provided eventId
      const [results] = await db.query(query, [req.params.eventId]);
      console("results.length");
      if (results.length === 0) {
        res.status(404).json({ error: 'No weather events found for this month' });
      } else {
        res.json(results);
      }
  } catch (error) {
      next(error);
  }
});

// Endpoint to fetch blizzard event details
router.get('/blizzard/:eventId', async (req, res, next) => {
  try {
      // SQL query to join WeatherEvent, Category, and Blizzard tables
      const query = `
          SELECT 
              WeatherEvent.*, 
              Category.category_name, 
              Blizzard.temperature, 
              Blizzard.wind_speed, 
              Blizzard.snow_depth 
          FROM 
              WeatherEvent 
          JOIN 
              Category ON WeatherEvent.category_id = Category.category_id 
          JOIN 
              Blizzard ON WeatherEvent.event_id = Blizzard.event_id 
          WHERE 
              WeatherEvent.event_id = ?;
      `;

      // Execute the query with the provided eventId
      const [results] = await db.query(query, [req.params.eventId]);
      console("results.length");
      if (results.length === 0) {
        res.status(404).json({ error: 'No weather events found for this month' });
      } else {
        res.json(results);
      }
  } catch (error) {
      next(error);
  }
});

// Endpoint to fetch tornado event details
router.get('/tornado/:eventId', async (req, res, next) => {
  try {
      // SQL query to join WeatherEvent, Category, and Tornado tables
      const query = `
          SELECT 
              WeatherEvent.*, 
              Category.category_name, 
              Tornado.temperature, 
              Tornado.wind_speed, 
              Tornado.ef_scale, 
              Tornado.tornado_size 
          FROM 
              WeatherEvent 
          JOIN 
              Category ON WeatherEvent.category_id = Category.category_id 
          JOIN 
              Tornado ON WeatherEvent.event_id = Tornado.event_id 
          WHERE 
              WeatherEvent.event_id = ?;
      `;

      // Execute the query with the provided eventId
      const [results] = await db.query(query, [req.params.eventId]);
      console("results.length");
      if (results.length === 0) {
        res.status(404).json({ error: 'No weather events found for this month' });
      } else {
        res.json(results);
      }
  } catch (error) {
      next(error);
  }
});


module.exports = router;
