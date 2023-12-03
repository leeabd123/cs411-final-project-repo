const express = require('express');
const mysql = require('mysql2');

// Initialize express app
const app = express();

// Use environment variable for port or default to 3000
const port = process.env.PORT || 3000;

// Create a MySQL pool connection
const pool = mysql.createPool({
  host: '34.41.207.129',
  user: 'root',
  password: '', // Use environment variable for the password
  database: 'cs411',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to check database connection
function checkDatabaseConnection(req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Error connecting to the database');
    }
    
    console.log('Successfully connected to the database');
    connection.release();
    next();
  });
}

// Use the database connection check middleware
app.use(checkDatabaseConnection);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
