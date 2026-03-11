const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Create a new product
router.post('/', productsController.createProduct);

// Get all products
router.get('/', productsController.getAllProducts);

// Get product by ID
router.get('/:id', productsController.getProductById);

// Update product
router.put('/:id', productsController.updateProduct);

// Delete product
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
