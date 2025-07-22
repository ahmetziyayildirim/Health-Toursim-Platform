const Package = require('../models/Package');

const samplePackages = [
  // WELLNESS & SPA PACKAGES
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
      { name: 'Thermal Spa', description: 'Daily thermal pools access', included: true },
      { name: 'Dietitian Consultation', description: 'Nutrition planning', included: true },
      { name: 'Airport Pickup', description: 'Transfer service', included: true }
    ],
    accommodation: {
      name: 'Pamukkale Thermal Hotel',
      type: 'spa-hotel',
      starRating: 4,
      amenities: ['Thermal Pools', 'Spa Center', 'Restaurant', 'WiFi'],
      roomType: 'Standard Double Room'
    },
    medicalFacility: {
      name: 'Pamukkale Health Center',
      type: 'wellness-center',
      accreditations: ['JCI', 'ISO 9001'],
      specializations: ['Thermal Therapy', 'Rheumatology'],
      doctors: [{ name: 'Dr. Mehmet Özkan', specialization: 'Thermal Medicine', experience: 15, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 20, currentBookings: 3 },
    rating: { average: 4.8, count: 127 },
    isActive: true,
    isFeatured: true,
    tags: ['thermal', 'wellness', 'spa', 'natural']
  },

  // DENTAL CARE PACKAGES  
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
      { name: 'Aesthetic Treatments', description: 'Cosmetic dental procedures', included: true },
      { name: 'Airport Pickup', description: 'Transfer service', included: true }
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
      doctors: [{ name: 'Dr. Ayşe Demir', specialization: 'Cosmetic Dentistry', experience: 12, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 15, currentBookings: 2 },
    rating: { average: 4.9, count: 89 },
    isActive: true,
    isFeatured: true,
    tags: ['dental', 'cosmetic', 'implants', 'quick']
  },

  {
    title: 'Premium Dental Implant Package',
    description: 'Advanced dental implant procedures with premium materials in Izmir.',
    location: {
      city: 'Izmir',
      country: 'Turkey',
      coordinates: { latitude: 38.4237, longitude: 27.1428 },
      address: 'Alsancak Dental Center, Izmir, Turkey'
    },
    duration: { days: 6, nights: 5 },
    pricing: {
      basePrice: 1200,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'half-board', transfers: true }
    },
    category: 'dental-care',
    experienceTypes: ['Treatment-Focused', 'Relaxing (Wellness)'],
    services: [
      { name: 'Doctor Consultation', description: '3D dental planning', included: true },
      { name: 'Surgery', description: 'Implant placement surgery', included: true },
      { name: 'Medical Tests', description: 'Pre-surgery tests', included: true },
      { name: 'Airport Pickup', description: 'VIP transfer', included: true }
    ],
    accommodation: {
      name: 'Izmir Bay Hotel',
      type: 'hotel',
      starRating: 5,
      amenities: ['Sea View', 'Spa', 'Pool', 'Restaurant'],
      roomType: 'Deluxe Sea View'
    },
    medicalFacility: {
      name: 'Izmir Advanced Dental Center',
      type: 'clinic',
      accreditations: ['JCI', 'ISO 13485'],
      specializations: ['Implantology', 'Oral Surgery'],
      doctors: [{ name: 'Dr. Cem Aktaş', specialization: 'Oral Surgery', experience: 18, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 10, currentBookings: 1 },
    rating: { average: 4.7, count: 76 },
    isActive: true,
    isFeatured: false,
    tags: ['dental', 'implants', 'surgery', 'premium']
  },

  // HAIR TRANSPLANT PACKAGES
  {
    title: 'Hair Transplant & Recovery Package',
    description: 'Advanced FUE hair transplant procedures in beautiful Antalya with luxury resort recovery.',
    location: {
      city: 'Antalya',
      country: 'Turkey',
      coordinates: { latitude: 36.8969, longitude: 30.7133 },
      address: 'Antalya Hair Center, Konyaalti, Antalya, Turkey'
    },
    duration: { days: 7, nights: 6 },
    pricing: {
      basePrice: 1200,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'full-board', transfers: true }
    },
    category: 'hair-transplant',
    experienceTypes: ['Treatment-Focused', 'Relaxing (Wellness)'],
    services: [
      { name: 'Doctor Consultation', description: 'Hair analysis and planning', included: true },
      { name: 'Aesthetic Treatments', description: 'FUE hair transplant', included: true },
      { name: 'Airport Pickup', description: 'VIP transfer', included: true }
    ],
    accommodation: {
      name: 'Antalya Beach Resort',
      type: 'resort',
      starRating: 5,
      amenities: ['Beach Access', 'Spa', 'Pool', 'Restaurant'],
      roomType: 'Sea View Room'
    },
    medicalFacility: {
      name: 'Antalya Hair Restoration Center',
      type: 'clinic',
      accreditations: ['JCI', 'ISHRS'],
      specializations: ['Hair Transplant', 'FUE Technique'],
      doctors: [{ name: 'Dr. Can Yılmaz', specialization: 'Hair Transplant Surgery', experience: 18, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 12, currentBookings: 4 },
    rating: { average: 4.7, count: 156 },
    isActive: true,
    isFeatured: true,
    tags: ['hair-transplant', 'fue', 'recovery', 'luxury']
  },

  {
    title: 'Rapid Hair Transplant Express',
    description: 'Quick 3-day hair transplant procedure in Istanbul with modern techniques.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Taksim Hair Clinic, Istanbul, Turkey'
    },
    duration: { days: 3, nights: 2 },
    pricing: {
      basePrice: 890,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'breakfast', transfers: true }
    },
    category: 'hair-transplant',
    experienceTypes: ['Treatment-Focused', 'Quick Care'],
    services: [
      { name: 'Doctor Consultation', description: 'Express hair analysis', included: true },
      { name: 'Surgery', description: 'FUE hair transplant', included: true },
      { name: 'Airport Pickup', description: 'Transfer service', included: true }
    ],
    accommodation: {
      name: 'Istanbul City Hotel',
      type: 'hotel',
      starRating: 4,
      amenities: ['City Center', 'WiFi', 'Restaurant'],
      roomType: 'Standard Room'
    },
    medicalFacility: {
      name: 'Istanbul Hair Express',
      type: 'clinic',
      accreditations: ['ISO 9001'],
      specializations: ['FUE Hair Transplant'],
      doctors: [{ name: 'Dr. Emre Koç', specialization: 'Hair Surgery', experience: 10, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 8, currentBookings: 2 },
    rating: { average: 4.4, count: 92 },
    isActive: true,
    isFeatured: false,
    tags: ['hair-transplant', 'quick', 'express', 'fue']
  },

  // AESTHETIC SURGERY PACKAGES
  {
    title: 'Complete Aesthetic Surgery Package',
    description: 'Comprehensive plastic surgery procedures in Istanbul.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Acıbadem Aesthetic Center, Istanbul, Turkey'
    },
    duration: { days: 10, nights: 9 },
    pricing: {
      basePrice: 3500,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'full-board', transfers: true }
    },
    category: 'aesthetic-surgery',
    experienceTypes: ['Treatment-Focused'],
    services: [
      { name: 'Doctor Consultation', description: 'Detailed aesthetic planning', included: true },
      { name: 'Surgery', description: 'Multiple aesthetic procedures', included: true },
      { name: 'Airport Pickup', description: 'VIP transfer', included: true }
    ],
    accommodation: {
      name: 'Istanbul Medical Hotel',
      type: 'hotel',
      starRating: 5,
      amenities: ['Medical Support', 'Spa', 'Restaurant', 'WiFi'],
      roomType: 'Medical Suite'
    },
    medicalFacility: {
      name: 'Acıbadem Aesthetic Hospital',
      type: 'hospital',
      accreditations: ['JCI', 'ISO 15189'],
      specializations: ['Plastic Surgery', 'Aesthetic Medicine'],
      doctors: [{ name: 'Dr. Selim Özkan', specialization: 'Plastic Surgery', experience: 22, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 5, currentBookings: 1 },
    rating: { average: 4.9, count: 34 },
    isActive: true,
    isFeatured: true,
    tags: ['aesthetic', 'surgery', 'plastic', 'comprehensive']
  },

  // HEALTH CHECKUP PACKAGES
  {
    title: 'Comprehensive Health Check-up Retreat',
    description: 'Complete health screening with advanced diagnostics in beautiful Bodrum coastal setting.',
    location: {
      city: 'Bodrum',
      country: 'Turkey',
      coordinates: { latitude: 37.0344, longitude: 27.4305 },
      address: 'Bodrum Medical Center, Bodrum, Turkey'
    },
    duration: { days: 4, nights: 3 },
    pricing: {
      basePrice: 920,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'half-board', transfers: true }
    },
    category: 'health-checkup',
    experienceTypes: ['Treatment-Focused', 'Close to Nature'],
    services: [
      { name: 'Doctor Consultation', description: 'Comprehensive medical consultation', included: true },
      { name: 'Health Screening', description: 'Full body diagnostics', included: true },
      { name: 'Airport Pickup', description: 'Transfer service', included: true }
    ],
    accommodation: {
      name: 'Bodrum Bay Resort',
      type: 'resort',
      starRating: 4,
      amenities: ['Sea View', 'Pool', 'Spa', 'Restaurant'],
      roomType: 'Deluxe Sea View'
    },
    medicalFacility: {
      name: 'Bodrum International Medical Center',
      type: 'medical-center',
      accreditations: ['JCI', 'ISO 9001'],
      specializations: ['Preventive Medicine', 'Cardiology'],
      doctors: [{ name: 'Dr. Elif Kaya', specialization: 'Preventive Medicine', experience: 20, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 15, currentBookings: 4 },
    rating: { average: 4.6, count: 94 },
    isActive: true,
    isFeatured: true,
    tags: ['health-checkup', 'preventive', 'comprehensive', 'coastal']
  },

  // WEIGHT LOSS PACKAGES
  {
    title: 'Bariatric Surgery Complete Package',
    description: 'Comprehensive weight loss surgery with gastric sleeve in Istanbul.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Istanbul Bariatric Center, Istanbul, Turkey'
    },
    duration: { days: 8, nights: 7 },
    pricing: {
      basePrice: 3200,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'full-board', transfers: true }
    },
    category: 'weight-loss',
    experienceTypes: ['Treatment-Focused'],
    services: [
      { name: 'Doctor Consultation', description: 'Bariatric specialist consultation', included: true },
      { name: 'Surgery', description: 'Gastric sleeve surgery', included: true },
      { name: 'Airport Pickup', description: 'Medical transfer', included: true }
    ],
    accommodation: {
      name: 'Istanbul Medical Resort',
      type: 'hospital',
      starRating: 5,
      amenities: ['Medical Support', 'Spa', 'Healthy Cuisine'],
      roomType: 'Medical Suite'
    },
    medicalFacility: {
      name: 'Istanbul Bariatric Surgery Center',
      type: 'hospital',
      accreditations: ['JCI', 'ASMBS'],
      specializations: ['Bariatric Surgery', 'Metabolic Surgery'],
      doctors: [{ name: 'Dr. Okan Yücel', specialization: 'Bariatric Surgery', experience: 19, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 6, currentBookings: 2 },
    rating: { average: 4.8, count: 91 },
    isActive: true,
    isFeatured: true,
    tags: ['bariatric', 'weight-loss', 'gastric-sleeve', 'life-changing']
  },

  // MEDICAL TREATMENT PACKAGES
  {
    title: 'Cardiac Surgery Excellence Program',
    description: 'World-class cardiac surgery with leading heart surgeons in Istanbul.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Anadolu Medical Center, Istanbul, Turkey'
    },
    duration: { days: 15, nights: 14 },
    pricing: {
      basePrice: 12000,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'all-inclusive', transfers: true }
    },
    category: 'medical-treatment',
    experienceTypes: ['Treatment-Focused'],
    services: [
      { name: 'Doctor Consultation', description: 'Cardiac specialist consultation', included: true },
      { name: 'Surgery', description: 'Cardiac surgical procedure', included: true },
      { name: 'Airport Pickup', description: 'Medical transfer', included: true }
    ],
    accommodation: {
      name: 'Istanbul Medical Suite',
      type: 'hospital',
      starRating: 5,
      amenities: ['ICU', 'Medical Support', 'Family Rooms'],
      roomType: 'Medical Suite'
    },
    medicalFacility: {
      name: 'Anadolu Heart Center',
      type: 'hospital',
      accreditations: ['JCI', 'ISO 15189'],
      specializations: ['Cardiac Surgery', 'Interventional Cardiology'],
      doctors: [{ name: 'Dr. Mehmet Özkan', specialization: 'Cardiac Surgery', experience: 28, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 3, currentBookings: 1 },
    rating: { average: 4.9, count: 23 },
    isActive: true,
    isFeatured: true,
    tags: ['cardiac', 'surgery', 'heart', 'medical']
  },

  // EYE SURGERY PACKAGES
  {
    title: 'LASIK Eye Surgery Package',
    description: 'Advanced LASIK eye surgery with latest technology in Istanbul.',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      coordinates: { latitude: 41.0082, longitude: 28.9784 },
      address: 'Istanbul Eye Center, Levent, Istanbul, Turkey'
    },
    duration: { days: 3, nights: 2 },
    pricing: {
      basePrice: 1800,
      currency: 'EUR',
      includes: { flights: false, accommodation: true, meals: 'breakfast', transfers: true }
    },
    category: 'eye-surgery',
    experienceTypes: ['Treatment-Focused', 'Quick Care'],
    services: [
      { name: 'Doctor Consultation', description: 'Eye examination and planning', included: true },
      { name: 'Surgery', description: 'LASIK eye surgery', included: true },
      { name: 'Airport Pickup', description: 'Transfer service', included: true }
    ],
    accommodation: {
      name: 'Istanbul Medical Hotel',
      type: 'hotel',
      starRating: 4,
      amenities: ['Medical Support', 'WiFi', 'Restaurant'],
      roomType: 'Medical Room'
    },
    medicalFacility: {
      name: 'Istanbul Eye Center',
      type: 'clinic',
      accreditations: ['JCI', 'ISO 13485'],
      specializations: ['LASIK Surgery', 'Ophthalmology'],
      doctors: [{ name: 'Dr. Ahmet Kaya', specialization: 'Eye Surgery', experience: 14, languages: ['Turkish', 'English'] }]
    },
    availability: { maxCapacity: 12, currentBookings: 2 },
    rating: { average: 4.5, count: 78 },
    isActive: true,
    isFeatured: false,
    tags: ['lasik', 'eye-surgery', 'vision', 'quick']
  }
];

async function seedPackages() {
  try {
    // Delete existing packages
    await Package.deleteMany({});
    console.log('Existing packages deleted');

    // Insert new packages
    const packages = await Package.insertMany(samplePackages);
    console.log(`${packages.length} packages created successfully`);

    return packages;
  } catch (error) {
    console.error('Error seeding packages:', error);
    throw error;
  }
}

module.exports = { seedPackages };
