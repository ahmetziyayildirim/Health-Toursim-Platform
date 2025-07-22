const User = require('../models/User');

// Create admin user data
const createAdminUser = async () => {
  const adminUserData = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@healthjourney.com',
    password: 'admin123', // Will be hashed by the model's pre-save middleware
    phone: '+90 (212) 555-0001',
    country: 'Turkey',
    role: 'admin',
    preferences: {
      budget: 0,
      dateRange: 'flexible',
      experiences: [],
      services: []
    },
    isEmailVerified: true,
    isActive: true
  };

  return adminUserData;
};

// Seed admin user to database
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@healthjourney.com' });
    
    if (!existingAdmin) {
      const adminUserData = await createAdminUser();
      const adminUser = await User.create(adminUserData);
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@healthjourney.com');
      console.log('🔑 Password: admin123');
      console.log('🆔 ID:', adminUser._id);
      return adminUser;
    } else {
      console.log('ℹ️ Admin user already exists');
      console.log('🆔 ID:', existingAdmin._id);
      return existingAdmin;
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

module.exports = { seedAdmin, createAdminUser };
