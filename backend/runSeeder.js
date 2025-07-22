const mongoose = require('mongoose');
require('dotenv').config();
const seedPackages = require('./src/seeders/packageSeeder');
const { seedAdmin } = require('./src/seeders/adminSeeder');
const { seedUsers } = require('./src/seeders/userSeeder');
const { seedBookings } = require('./src/seeders/bookingSeeder');
const connectDB = require('./src/config/database');

const runSeeder = async () => {
  try {
    // Use the same database connection as the server
    await connectDB();
    console.log('📊 Connected to MongoDB');

    // Clear existing data first (optional)
    console.log('🗑️ Clearing existing data...');
    
    // Run all seeders in order
    console.log('🌱 Starting seeding process...');
    
    // 1. Seed admin user first
    await seedAdmin();
    
    // 2. Seed regular users
    await seedUsers();
    
    // 3. Seed packages
    await seedPackages();
    
    // 4. Seed bookings (depends on users and packages)
    await seedBookings();
    
    console.log('🎉 All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
