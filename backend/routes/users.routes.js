const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Create a new user
router.post('/', usersController.createUser);

// Get all users
router.get('/', usersController.getAllUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Delete user
router.delete('/:id', usersController.deleteUser);

module.exports = router;