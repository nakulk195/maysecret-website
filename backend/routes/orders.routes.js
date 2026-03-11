const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

// Create a new order
router.post('/', ordersController.createOrder);

// Get all orders
router.get('/', ordersController.getAllOrders);

// Get order by ID
router.get('/:id', ordersController.getOrderById);

module.exports = router;
