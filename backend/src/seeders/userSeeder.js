const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Clear existing users (except admin)
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🗑️ Cleared existing users (kept admin)');

    // Create sample users
    const users = [];
    
    // User 1
    const user1 = new User({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@email.com',
      password: 'password123',
      phone: '+1-555-0123',
      country: 'United States',
      dateOfBirth: new Date('1985-03-15'),
      role: 'user',
      preferences: {
        budget: 1000,
        dateRange: 'next-3-months',
        experiences: ['Relaxing (Wellness)', 'Close to Nature'],
        services: ['Doctor Consultation', 'Thermal Spa', 'Sightseeing Tours']
      },
      healthInfo: {
        conditions: 'None',
        allergies: 'None',
        medications: 'None',
        specialRequirements: 'Vegetarian meals preferred'
      },
      isEmailVerified: true,
      isActive: true
    });
    
    await user1.save();
    users.push(user1);
    console.log(`✅ Created user 1: ${user1.email}`);

    // User 2
    const user2 = new User({
      firstName: 'Michael',
      lastName: 'Smith',
      email: 'michael.smith@email.com',
      password: 'password123',
      phone: '+44-20-7946-0958',
      country: 'United Kingdom',
      dateOfBirth: new Date('1978-07-22'),
      role: 'user',
      preferences: {
        budget: 800,
        dateRange: 'next-month',
        experiences: ['Treatment-Focused', 'Quick Care'],
        services: ['Doctor Consultation', 'Health Screening', 'Airport Pickup']
      },
      healthInfo: {
        conditions: 'Mild hypertension',
        allergies: 'Penicillin',
        medications: 'Lisinopril 10mg daily',
        specialRequirements: 'Need wheelchair accessible facilities'
      },
      isEmailVerified: true,
      isActive: true
    });
    
    await user2.save();
    users.push(user2);
    console.log(`✅ Created user 2: ${user2.email}`);

    // User 3
    const user3 = new User({
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@email.com',
      password: 'password123',
      phone: '+1-416-555-0199',
      country: 'Canada',
      dateOfBirth: new Date('1982-11-08'),
      role: 'user',
      preferences: {
        budget: 1500,
        dateRange: 'next-6-months',
        experiences: ['Treatment-Focused', 'Family-Friendly'],
        services: ['Doctor Consultation', 'Aesthetic Treatments', 'Dietitian Consultation']
      },
      healthInfo: {
        conditions: 'Type 2 Diabetes',
        allergies: 'Shellfish',
        medications: 'Metformin 500mg twice daily',
        specialRequirements: 'Diabetic-friendly meals required'
      },
      isEmailVerified: true,
      isActive: true
    });
    
    await user3.save();
    users.push(user3);
    console.log(`✅ Created user 3: ${user3.email}`);

    // User 4
    const user4 = new User({
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      password: 'password123',
      phone: '+49-30-12345678',
      country: 'Germany',
      dateOfBirth: new Date('1975-05-30'),
      role: 'user',
      preferences: {
        budget: 1200,
        dateRange: 'flexible',
        experiences: ['Relaxing (Wellness)', 'Treatment-Focused'],
        services: ['Doctor Consultation', 'Health Screening', 'Thermal Spa', 'Psychological Counseling']
      },
      healthInfo: {
        conditions: 'Anxiety disorder',
        allergies: 'Latex',
        medications: 'Sertraline 50mg daily',
        specialRequirements: 'Quiet room preferred, latex-free environment'
      },
      isEmailVerified: true,
      isActive: true
    });
    
    await user4.save();
    users.push(user4);
    console.log(`✅ Created user 4: ${user4.email}`);

    // User 5
    const user5 = new User({
      firstName: 'Emma',
      lastName: 'Garcia',
      email: 'emma.garcia@email.com',
      password: 'password123',
      phone: '+34-91-123-4567',
      country: 'Spain',
      dateOfBirth: new Date('1990-09-12'),
      role: 'user',
      preferences: {
        budget: 900,
        dateRange: 'next-3-months',
        experiences: ['Relaxing (Wellness)', 'Close to Nature'],
        services: ['Doctor Consultation', 'Aesthetic Treatments', 'Thermal Spa']
      },
      healthInfo: {
        conditions: 'None',
        allergies: 'Pollen',
        medications: 'Antihistamines as needed',
        specialRequirements: 'Prefer organic/natural treatments'
      },
      isEmailVerified: true,
      isActive: true
    });
    
    await user5.save();
    users.push(user5);
    console.log(`✅ Created user 5: ${user5.email}`);

    // User 6 - Inactive user
    const user6 = new User({
      firstName: 'James',
      lastName: 'Miller',
      email: 'james.miller@email.com',
      password: 'password123',
      phone: '+61-2-9876-5432',
      country: 'Australia',
      dateOfBirth: new Date('1988-12-03'),
      role: 'user',
      preferences: {
        budget: 2000,
        dateRange: 'flexible',
        experiences: ['Treatment-Focused'],
        services: ['Doctor Consultation', 'Health Screening']
      },
      healthInfo: {
        conditions: 'None',
        allergies: 'None',
        medications: 'None',
        specialRequirements: 'None'
      },
      isEmailVerified: false,
      isActive: false
    });
    
    await user6.save();
    users.push(user6);
    console.log(`✅ Created user 6: ${user6.email} (inactive)`);

    console.log(`✅ Seeded ${users.length} users successfully`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = { seedUsers };
