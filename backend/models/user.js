const db = require('../db'); // Ensure this is the promise-based pool

const userController = {

  loginUser: async (req, res) => {
    const { user_name, password } = req.body;
    const query = 'SELECT * FROM User WHERE user_name = ? AND password = ?';

    try {
      const [results] = await db.query(query, [user_name, password]);
      if (results.length > 0) {
        res.json({ message: 'Login successful', user: results[0] });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  createUser: async (req, res) => {
    const { user_name, password } = req.body;
    const query = 'INSERT INTO User (user_name, password) VALUES (?, ?)';

    try {
      const [results] = await db.query(query, [user_name, password]);
      res.status(201).json({ message: 'User created', userId: results.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    const query = 'SELECT * FROM User';

    try {
      const [results] = await db.query(query);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserById: async (req, res) => {
    const query = 'SELECT * FROM User WHERE User_id = ?';

    try {
      const [results] = await db.query(query, [req.params.id]);
      res.json(results[0] || { message: 'User not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateUserById: async (req, res) => {
    const { user_name, password } = req.body;
    const query = 'UPDATE User SET user_name = ?, password = ? WHERE User_id = ?';

    try {
      await db.query(query, [user_name, password, req.params.id]);
      res.json({ message: 'User updated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteUserById: async (req, res) => {
    const query = 'DELETE FROM User WHERE User_id = ?';

    try {
      await db.query(query, [req.params.id]);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = userController;
