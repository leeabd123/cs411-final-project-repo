// routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../models/user');

// Create a new user
router.post('/', userController.createUser);

// Retrieve all users
router.get('/', userController.getAllUsers);

// Retrieve a single user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUserById);

// Delete a user by ID
router.delete('/:id', userController.deleteUserById);

module.exports = router;


