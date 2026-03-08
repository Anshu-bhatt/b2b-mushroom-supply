const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  submitInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  getInquiryStats
} = require('../controllers/inquiryController');

// Validation middleware for inquiry submission
const inquiryValidation = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .trim(),
  body('companyName')
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters long')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 digits')
    .trim(),
  body('productRequired')
    .isLength({ min: 2 })
    .withMessage('Product requirement must be specified')
    .trim(),
  body('quantity')
    .isLength({ min: 1 })
    .withMessage('Quantity must be specified')
    .trim(),
  body('purpose')
    .optional()
    .trim(),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
    .trim()
];

// @route   POST /api/inquiry
// @desc    Submit new bulk inquiry
// @access  Public
router.post('/', inquiryValidation, submitInquiry);

// @route   GET /api/inquiry/stats
// @desc    Get inquiry statistics (admin)
// @access  Private (in production, add auth middleware)
router.get('/stats', getInquiryStats);

// @route   GET /api/inquiry
// @desc    Get all inquiries (admin)
// @access  Private (in production, add auth middleware)
router.get('/', getInquiries);

// @route   GET /api/inquiry/:id
// @desc    Get inquiry by ID (admin)
// @access  Private (in production, add auth middleware)
router.get('/:id', getInquiry);

// @route   PUT /api/inquiry/:id
// @desc    Update inquiry status (admin)
// @access  Private (in production, add auth middleware)
router.put('/:id', updateInquiry);

module.exports = router;