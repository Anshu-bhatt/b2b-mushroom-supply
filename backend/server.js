const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// Import database and email service
const { connectDB } = require('./config/database');
const { testEmailConfiguration } = require('./config/emailService');

// Initialize Express app
const app = express();

// Trust proxy (for deployment behind reverse proxies like Heroku, Railway, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:5500', // Live Server
      'http://127.0.0.1:5500',
      'https://vercel.app',
      'https://netlify.app'
    ];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace(/https?:\/\//, '')))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'B2B Mushroom Supply API is running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/products/categories',
      search: '/api/products/search',
      inquiry: '/api/inquiry (POST)',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiry', inquiryRoutes);

// Note: backend is deployed as API-only service.

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error occurred:', error);
  
  // CORS error
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }
  
  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Handle undefined routes (404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    console.log('🔍 Connecting to database...');
    const isDbConnected = await connectDB();
    if (!isDbConnected) {
      console.log('⚠️  Database unavailable at startup. API will run, but DB-backed routes may fail until connection is fixed.');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log('🍄 B2B Mushroom Supply API Server Started');
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 API status: http://localhost:${PORT}/api/status`);
      console.log(`📚 Products API: http://localhost:${PORT}/api/products`);
      console.log(`📋 Inquiry API: http://localhost:${PORT}/api/inquiry`);
      console.log('─'.repeat(60));

      // Run email verification in background so startup isn't blocked by SMTP timeout.
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('🔍 Testing email configuration...');
        testEmailConfiguration().catch((error) => {
          console.error('⚠️  Email verification check failed:', error.message || error);
        });
      } else {
        console.log('⚠️  Email not configured - inquiry notifications disabled');
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;