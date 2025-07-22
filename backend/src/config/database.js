const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDB = async () => {
  try {
    // For development, use MongoDB Memory Server if no local MongoDB
    if (process.env.NODE_ENV === 'development' && process.env.MONGODB_URI === 'memory') {
      console.log('🚀 Starting MongoDB Memory Server...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      process.env.MONGODB_URI = uri;
      console.log('✅ MongoDB Memory Server started');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
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

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️ Continuing without database connection...');
    
    // In development, continue without database
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Server will run without database');
      return;
    }
    
    // In production, exit on database error
    process.exit(1);
  }
};

module.exports = connectDB;
