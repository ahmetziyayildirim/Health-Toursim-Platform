const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration for both development and production
const allowedOrigins = [
  // Development origins
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:5001',
  'http://localhost:5002',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // Production origins (will be set via environment variables)
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - TEMPORARILY DISABLED
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
connectDB();

// Auto-create all seed data after database connection
setTimeout(async () => {
  try {
    console.log('🌱 Starting automatic seeding process...');
    
    // Import all models and seeders
    const User = require('./models/User');
    const Package = require('./models/Package');
    const Booking = require('./models/Booking');
    const Review = require('./models/Review');
    
    const { seedAdmin } = require('./seeders/adminSeeder');
    const { seedUsers } = require('./seeders/userSeeder');
    const { seedPackages } = require('./seeders/packageSeeder');
    const { seedBookings } = require('./seeders/bookingSeeder');
    const { seedReviews } = require('./seeders/reviewSeeder');

    // 1. Check and create admin user
    const existingAdmin = await User.findOne({ email: 'admin@healthjourney.com' });
    if (!existingAdmin) {
      console.log('🔧 Creating admin user...');
      await seedAdmin();
      console.log('✅ Admin user created automatically');
    } else {
      console.log('✅ Admin user already exists');
    }

    // 2. Check and create regular users
    const userCount = await User.countDocuments({ role: 'user' });
    if (userCount === 0) {
      console.log('👥 Creating sample users...');
      const users = await seedUsers();
      console.log(`✅ Created ${users.length} sample users`);
    } else {
      console.log(`✅ Found ${userCount} existing users`);
    }

    // 3. Check and create packages
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      console.log('📦 Creating sample packages...');
      const packages = await seedPackages();
      console.log(`✅ Created ${packages.length} sample packages`);
    } else {
      console.log(`✅ Found ${packageCount} existing packages`);
    }

    // 4. Check and create bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('📋 Creating sample bookings...');
      const bookings = await seedBookings();
      console.log(`✅ Created ${bookings.length} sample bookings`);
    } else {
      console.log(`✅ Found ${bookingCount} existing bookings`);
    }

    // 5. Check and create reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('⭐ Creating sample reviews...');
      const reviews = await seedReviews();
      console.log(`✅ Created ${reviews.length} sample reviews`);
    } else {
      console.log(`✅ Found ${reviewCount} existing reviews`);
    }

    console.log('🎉 Automatic seeding process completed successfully!');
  } catch (error) {
    console.error('❌ Error in automatic seeding:', error.message);
    console.error('📝 Stack trace:', error.stack);
  }
}, 3000); // Wait 3 seconds for database connection

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Health Tourism Platform API',
    version: '1.0.0',
    status: 'Server is running successfully',
    endpoints: {
      health: '/health',
      api_info: '/api',
      auth: '/api/auth',
      packages: '/api/packages',
      admin: '/api/admin'
    },
    documentation: 'Visit /api for more information'
  });
});

// Development test and seeder endpoints
if (process.env.NODE_ENV === 'development') {
  // Test login endpoint
  app.post('/api/test/login', async (req, res) => {
    try {
      const User = require('./models/User');
      const admin = await User.findOne({ email: 'admin@healthjourney.com' }).select('+password');
      
      if (admin) {
        const isMatch = await admin.matchPassword('admin123');
        res.json({
          success: true,
          adminExists: true,
          passwordHash: admin.password.substring(0, 20) + '...',
          passwordMatch: isMatch,
          adminData: {
            id: admin._id,
            email: admin.email,
            role: admin.role
          }
        });
      } else {
        res.json({
          success: false,
          adminExists: false,
          message: 'Admin not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.post('/api/seed/packages', async (req, res) => {
    try {
      const { seedPackages } = require('./seeders/packageSeeder');
      const packages = await seedPackages();
      res.status(200).json({
        success: true,
        message: `Successfully seeded ${packages.length} packages`,
        data: packages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error seeding packages',
        error: error.message
      });
    }
  });

  app.post('/api/seed/admin', async (req, res) => {
    try {
      const { seedAdmin } = require('./seeders/adminSeeder');
      const admin = await seedAdmin();
      res.status(200).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating admin user',
        error: error.message
      });
    }
  });

  app.post('/api/seed/bookings', async (req, res) => {
    try {
      const { seedBookings } = require('./seeders/bookingSeeder');
      const bookings = await seedBookings();
      res.status(200).json({
        success: true,
        message: `Successfully seeded ${bookings.length} bookings`,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error seeding bookings',
        error: error.message
      });
    }
  });

  app.post('/api/seed/users', async (req, res) => {
    try {
      const { seedUsers } = require('./seeders/userSeeder');
      const users = await seedUsers();
      res.status(200).json({
        success: true,
        message: `Successfully seeded ${users.length} users`,
        data: users.map(user => ({
          id: user._id,
          name: user.fullName,
          email: user.email,
          country: user.country,
          isActive: user.isActive
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error seeding users',
        error: error.message
      });
    }
  });

  app.post('/api/seed/reviews', async (req, res) => {
    try {
      const { seedReviews } = require('./seeders/reviewSeeder');
      const reviews = await seedReviews();
      res.status(200).json({
        success: true,
        message: `Successfully seeded ${reviews.length} reviews`,
        data: reviews.map(review => ({
          id: review._id,
          rating: review.rating,
          title: review.title,
          isVerified: review.isVerified,
          packageId: review.package,
          userId: review.user
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error seeding reviews',
        error: error.message
      });
    }
  });
}
// app.use('/api/packages', require('./routes/packages'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/chat', require('./routes/chat'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Health Tourism Platform API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health Tourism Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      packages: '/api/packages',
      bookings: '/api/bookings',
      chat: '/api/chat'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found` 
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔄 Server restarted successfully - CORS updated`);
});

module.exports = app;
