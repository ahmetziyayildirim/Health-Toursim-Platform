const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // For development, use MongoDB Memory Server if no MongoDB URI provided
    if (process.env.NODE_ENV === 'development' && (!mongoUri || mongoUri === 'memory')) {
      console.log('🚀 Starting MongoDB Memory Server for development...');
      try {
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('✅ MongoDB Memory Server started at:', mongoUri);
      } catch (memServerError) {
        console.error('❌ MongoDB Memory Server failed to start:', memServerError.message);
        throw memServerError;
      }
    }

    // Validate MongoDB URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 10000 : 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: true, // Enable mongoose buffering for better error handling
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed through app termination');
      }
      if (mongod) {
        await mongod.stop();
        console.log('🔌 MongoDB Memory Server stopped');
      }
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed through SIGTERM');
      }
      if (mongod) {
        await mongod.stop();
        console.log('🔌 MongoDB Memory Server stopped');
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // In development, continue without database for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Server will run without database');
      return;
    }
    
    // In production, exit on database error
    console.error('💥 Production database connection failed. Exiting...');
    process.exit(1);
  }
};

module.exports = connectDB;
