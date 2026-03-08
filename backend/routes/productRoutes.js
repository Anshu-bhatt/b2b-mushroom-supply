const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductCategories,
  searchProducts
} = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products with optional category filtering
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/categories
// @desc    Get product categories with count
// @access  Public
router.get('/categories', getProductCategories);

// @route   GET /api/products/search
// @desc    Search products by name or description
// @access  Public
router.get('/search', searchProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', getProductById);

module.exports = router;