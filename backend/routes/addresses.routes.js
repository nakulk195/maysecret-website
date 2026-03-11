const express = require('express');
const router = express.Router();
const addressesController = require('../controllers/addresses.controller');

// Create a new address
router.post('/', addressesController.createAddress);

// Get all addresses
router.get('/', addressesController.getAllAddresses);

// Delete address
router.delete('/:id', addressesController.deleteAddress);

module.exports = router;
