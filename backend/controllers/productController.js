const { products } = require('../models/Product');

// Get all products with optional category filtering
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id == id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get product categories
const getProductCategories = async (req, res) => {
  try {
    const categories = [
      {
        id: 'fresh',
        name: 'Fresh Mushrooms',
        description: 'Premium quality fresh mushrooms for food processing and wholesale distribution',
        products: products.filter(p => p.category === 'fresh').length
      },
      {
        id: 'dry',
        name: 'Dry Mushrooms',
        description: 'Dehydrated mushrooms with extended shelf life for industrial applications',
        products: products.filter(p => p.category === 'dry').length
      },
      {
        id: 'medicinal',
        name: 'Medicinal Mushrooms',
        description: 'Pharmaceutical-grade mushrooms for health and wellness applications',
        products: products.filter(p => p.category === 'medicinal').length
      },
      {
        id: 'ingredients',
        name: 'Food & Pharma Ingredients',
        description: 'Mushroom-derived additives and pharmaceutical intermediates',
        products: products.filter(p => p.category === 'ingredients').length
      }
    ];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Search products by name or description
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = q.toLowerCase();
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.applications.some(app => app.toLowerCase().includes(searchTerm))
    );
    
    res.json({
      success: true,
      count: searchResults.length,
      query: q,
      data: searchResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductCategories,
  searchProducts
};