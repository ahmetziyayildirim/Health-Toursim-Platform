const express = require('express');
const Package = require('../models/Package');
const router = express.Router();

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

// Seed packages
router.post('/packages', async (req, res) => {
  try {
    await Package.deleteMany({});
    const packages = await Package.insertMany(samplePackages);
    
    res.status(200).json({
      success: true,
      message: 'Packages seeded successfully',
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding packages',
      error: error.message
    });
  }
});

module.exports = router;
