const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Public //

// Get all products (public)
router.get('/products', ProductController.getAllProducts);
// Get product by ID (public)
router.get('/products/:id', ProductController.getProductById);
// Get product by Category (public)
router.get('/products/category/:category', ProductController.getProductByCategory);

// Admin //

// Create a new product (admin-only)
router.post('/admin/products', authMiddleware, ProductController.createProduct);
// Update product by ID (admin-only)
router.put('/admin/products/:id', authMiddleware, ProductController.updateProduct);
// Delete product by ID (admin-only)
router.delete('/admin/products/:id', authMiddleware, ProductController.deleteProduct);

module.exports = router;
