const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function testAdmin() {
  try {
    // MongoDB Memory Server'ı başlat
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Memory Server connected');
    
    // Admin bilgilerini kontrol et
    const admin = await User.findOne({ email: 'admin@healthjourney.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      console.log('Creating admin user...');
      
      // Admin kullanıcısı oluştur
      const { seedAdmin } = require('./src/seeders/adminSeeder');
      const newAdmin = await seedAdmin();
      console.log('✅ Admin user created successfully');
      
      process.exit(0);
    }
    
    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.password.substring(0, 20) + '...');
    
    // Şifre testi
    const testPassword = 'admin123';
    const isMatch = await admin.matchPassword(testPassword);
    console.log('Password test (admin123):', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    // Manuel hash testi
    const manualMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('Manual bcrypt test:', manualMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAdmin();