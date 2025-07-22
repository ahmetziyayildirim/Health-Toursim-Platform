const mongoose = require('mongoose');
const Package = require('./src/models/Package');
const connectDB = require('./src/config/database');
require('dotenv').config();

const samplePackages = [
  {
    title: 'Wellness & Thermal Spa Retreat',
    description: 'A perfect blend of relaxation and health care in the beautiful thermal springs of Pamukkale.',
    location: {
      city: 'Pamukkale',
      country: 'Turkey',
      coordinates: { latitude: 37.9244, longitude: 29.1211 },
      address: 'Pamukkale Thermal Springs, Denizli, Turkey'
    },
    duration: { days: 5, nights: 4 },
    pricing: {
      basePrice: 850,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'half-board', transfers: true }
    },
    category: 'wellness-spa',
    experienceTypes: ['Relaxing (Wellness)', 'Close to Nature'],
    services: [
      { name: 'Doctor Consultation', description: 'Initial health assessment', included: true },
      { name: 'Health Screening', description: 'Comprehensive health check-up', included: true },
      { name: 'Thermal Spa', description: 'Daily access to thermal pools', included: true }
    ],
    accommodation: {
      name: 'Pamukkale Thermal Hotel',
      type: 'spa-hotel',
      starRating: 4,
      amenities: ['Thermal Pools', 'Spa Center', 'Restaurant'],
      roomType: 'Standard Double Room'
    },
    medicalFacility: {
      name: 'Pamukkale Health Center',
      type: 'wellness-center',
      accreditations: ['JCI', 'ISO 9001'],
      specializations: ['Thermal Therapy', 'Rheumatology'],
      doctors: [
        {
          name: 'Dr. Mehmet Özkan',
          specialization: 'Thermal Medicine',
          experience: 15,
          languages: ['Turkish', 'English']
        }
      ]
    },
    rating: { average: 4.8, count: 127 },
    isActive: true,
    isFeatured: true,
    tags: ['thermal', 'wellness', 'spa']
  },
  {
    title: 'Dental Care Excellence Package',
    description: 'Complete dental care with state-of-the-art technology in Istanbul.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Nisantasi Medical Center, Istanbul, Turkey'
    },
    duration: { days: 3, nights: 2 },
    pricing: {
      basePrice: 650,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'breakfast', transfers: true }
    },
    category: 'dental-care',
    experienceTypes: ['Treatment-Focused', 'Quick Care'],
    services: [
      { name: 'Doctor Consultation', description: 'Dental examination', included: true },
      { name: 'Aesthetic Treatments', description: 'Cosmetic dental procedures', included: true }
    ],
    accommodation: {
      name: 'Istanbul Business Hotel',
      type: 'hotel',
      starRating: 4,
      amenities: ['WiFi', 'Restaurant', 'Gym'],
      roomType: 'Standard Room'
    },
    medicalFacility: {
      name: 'Istanbul Dental Excellence',
      type: 'clinic',
      accreditations: ['JCI', 'ISO 13485'],
      specializations: ['Implantology', 'Cosmetic Dentistry'],
      doctors: [
        {
          name: 'Dr. Ayşe Demir',
          specialization: 'Cosmetic Dentistry',
          experience: 12,
          languages: ['Turkish', 'English']
        }
      ]
    },
    rating: { average: 4.9, count: 89 },
    isActive: true,
    isFeatured: true,
    tags: ['dental', 'cosmetic', 'quick']
  }
];

async function createPackages() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    await Package.deleteMany({});
    console.log('Cleared existing packages');
    
    const packages = await Package.insertMany(samplePackages);
    console.log('Created packages:');
    packages.forEach(p => {
      console.log(`- ID: ${p._id}, Title: ${p.title}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createPackages();
