const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

const seedBookings = async () => {
  try {
    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('🗑️ Cleared existing bookings');

    // Get packages and users for reference
    const packages = await Package.find();
    const users = await User.find({ role: 'user' });
    
    if (packages.length === 0) {
      console.log('⚠️ No packages found. Please seed packages first.');
      return [];
    }

    if (users.length === 0) {
      console.log('⚠️ No users found. Please seed users first.');
      return [];
    }

    console.log(`📦 Found ${packages.length} packages and ${users.length} users`);

    // Create bookings using real users and packages
    const bookings = [];
    
    // Booking 1 - Alice Johnson
    const booking1 = new Booking({
      user: users[0]._id, // Alice Johnson
      package: packages[0]._id,
      bookingNumber: 'HT202501001',
      personalInfo: {
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        email: users[0].email,
        phone: users[0].phone,
        country: users[0].country,
        dateOfBirth: users[0].dateOfBirth
      },
      travelDates: {
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-02-20')
      },
      pricing: {
        basePrice: packages[0].pricing.basePrice,
        additionalServices: 0,
        discounts: 50,
        taxes: Math.round(packages[0].pricing.basePrice * 0.1),
        totalPrice: packages[0].pricing.basePrice + Math.round(packages[0].pricing.basePrice * 0.1) - 50
      },
      status: 'confirmed'
    });
    
    await booking1.save();
    bookings.push(booking1);
    console.log(`✅ Created booking 1: ${booking1.bookingNumber} for ${users[0].firstName} ${users[0].lastName}`);

    // Booking 2 - Michael Smith
    if (users.length > 1 && packages.length > 1) {
      const booking2 = new Booking({
        user: users[1]._id, // Michael Smith
        package: packages[1]._id,
        bookingNumber: 'HT202501002',
        personalInfo: {
          firstName: users[1].firstName,
          lastName: users[1].lastName,
          email: users[1].email,
          phone: users[1].phone,
          country: users[1].country,
          dateOfBirth: users[1].dateOfBirth
        },
        travelDates: {
          startDate: new Date('2025-03-10'),
          endDate: new Date('2025-03-13')
        },
        pricing: {
          basePrice: packages[1].pricing.basePrice,
          additionalServices: 100,
          discounts: 0,
          taxes: Math.round(packages[1].pricing.basePrice * 0.1),
          totalPrice: packages[1].pricing.basePrice + 100 + Math.round(packages[1].pricing.basePrice * 0.1)
        },
        status: 'payment-completed'
      });
      
      await booking2.save();
      bookings.push(booking2);
      console.log(`✅ Created booking 2: ${booking2.bookingNumber} for ${users[1].firstName} ${users[1].lastName}`);
    }

    // Booking 3 - David Brown
    if (users.length > 2 && packages.length > 2) {
      const booking3 = new Booking({
        user: users[2]._id, // David Brown
        package: packages[2]._id,
        bookingNumber: 'HT202501003',
        personalInfo: {
          firstName: users[2].firstName,
          lastName: users[2].lastName,
          email: users[2].email,
          phone: users[2].phone,
          country: users[2].country,
          dateOfBirth: users[2].dateOfBirth
        },
        travelDates: {
          startDate: new Date('2025-04-05'),
          endDate: new Date('2025-04-12')
        },
        pricing: {
          basePrice: packages[2].pricing.basePrice,
          additionalServices: 200,
          discounts: 100,
          taxes: Math.round(packages[2].pricing.basePrice * 0.1),
          totalPrice: packages[2].pricing.basePrice + 200 + Math.round(packages[2].pricing.basePrice * 0.1) - 100
        },
        status: 'pending-confirmation'
      });
      
      await booking3.save();
      bookings.push(booking3);
      console.log(`✅ Created booking 3: ${booking3.bookingNumber} for ${users[2].firstName} ${users[2].lastName}`);
    }

    // Booking 4 - Sarah Wilson
    if (users.length > 3 && packages.length > 3) {
      const booking4 = new Booking({
        user: users[3]._id, // Sarah Wilson
        package: packages[3]._id,
        bookingNumber: 'HT202501004',
        personalInfo: {
          firstName: users[3].firstName,
          lastName: users[3].lastName,
          email: users[3].email,
          phone: users[3].phone,
          country: users[3].country,
          dateOfBirth: users[3].dateOfBirth
        },
        travelDates: {
          startDate: new Date('2025-05-20'),
          endDate: new Date('2025-05-24')
        },
        pricing: {
          basePrice: packages[3].pricing.basePrice,
          additionalServices: 150,
          discounts: 70,
          taxes: Math.round(packages[3].pricing.basePrice * 0.1),
          totalPrice: packages[3].pricing.basePrice + 150 + Math.round(packages[3].pricing.basePrice * 0.1) - 70
        },
        status: 'documents-required'
      });
      
      await booking4.save();
      bookings.push(booking4);
      console.log(`✅ Created booking 4: ${booking4.bookingNumber} for ${users[3].firstName} ${users[3].lastName}`);
    }

    // Booking 5 - Emma Garcia (if available)
    if (users.length > 4) {
      const booking5 = new Booking({
        user: users[4]._id, // Emma Garcia
        package: packages[0]._id, // Reuse first package
        bookingNumber: 'HT202501005',
        personalInfo: {
          firstName: users[4].firstName,
          lastName: users[4].lastName,
          email: users[4].email,
          phone: users[4].phone,
          country: users[4].country,
          dateOfBirth: users[4].dateOfBirth
        },
        travelDates: {
          startDate: new Date('2025-06-15'),
          endDate: new Date('2025-06-18')
        },
        pricing: {
          basePrice: packages[0].pricing.basePrice,
          additionalServices: 75,
          discounts: 25,
          taxes: Math.round(packages[0].pricing.basePrice * 0.1),
          totalPrice: packages[0].pricing.basePrice + 75 + Math.round(packages[0].pricing.basePrice * 0.1) - 25
        },
        status: 'payment-pending'
      });
      
      await booking5.save();
      bookings.push(booking5);
      console.log(`✅ Created booking 5: ${booking5.bookingNumber} for ${users[4].firstName} ${users[4].lastName}`);
    }

    console.log(`✅ Seeded ${bookings.length} bookings successfully`);
    return bookings;
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
    throw error;
  }
};

module.exports = { seedBookings };
