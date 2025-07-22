const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'Turkey'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'TRY', 'GBP']
    },
    includes: {
      flights: {
        type: Boolean,
        default: false
      },
      accommodation: {
        type: Boolean,
        default: true
      },
      meals: {
        type: String,
        enum: ['none', 'breakfast', 'half-board', 'full-board', 'all-inclusive'],
        default: 'breakfast'
      },
      transfers: {
        type: Boolean,
        default: true
      }
    },
    discounts: [{
      type: {
        type: String,
        enum: ['early-bird', 'group', 'seasonal', 'loyalty']
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      },
      validUntil: Date,
      minBookings: Number
    }]
  },
  category: {
    type: String,
    required: [true, 'Package category is required'],
    enum: [
      'wellness-spa',
      'medical-treatment',
      'dental-care',
      'aesthetic-surgery',
      'health-checkup',
      'rehabilitation',
      'fertility-treatment',
      'eye-surgery',
      'hair-transplant',
      'weight-loss'
    ]
  },
  experienceTypes: [{
    type: String,
    enum: ['Relaxing (Wellness)', 'Treatment-Focused', 'Close to Nature', 'Family-Friendly', 'Quick Care']
  }],
  services: [{
    name: {
      type: String,
      required: true,
      enum: [
        'Doctor Consultation',
        'Health Screening',
        'Aesthetic Treatments',
        'Psychological Counseling',
        'Thermal Spa',
        'Dietitian Consultation',
        'Sightseeing Tours',
        'Airport Pickup',
        'Medical Tests',
        'Surgery',
        'Physiotherapy',
        'Massage Therapy',
        'Accommodation',
        'Meals',
        'Translation Services'
      ]
    },
    description: String,
    included: {
      type: Boolean,
      default: true
    },
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  accommodation: {
    name: String,
    type: {
      type: String,
      enum: ['hotel', 'resort', 'clinic', 'spa-hotel', 'hospital'],
      default: 'hotel'
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5
    },
    amenities: [String],
    roomType: String
  },
  medicalFacility: {
    name: {
      type: String,
      required: [true, 'Medical facility name is required']
    },
    type: {
      type: String,
      enum: ['hospital', 'clinic', 'spa', 'wellness-center', 'medical-center'],
      required: true
    },
    accreditations: [String],
    specializations: [String],
    doctors: [{
      name: String,
      specialization: String,
      experience: Number,
      languages: [String]
    }]
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['main', 'accommodation', 'facility', 'location', 'activity']
    }
  }],
  availability: {
    startDate: Date,
    endDate: Date,
    blackoutDates: [Date],
    maxCapacity: {
      type: Number,
      default: 10
    },
    currentBookings: {
      type: Number,
      default: 0
    }
  },
  requirements: {
    minAge: Number,
    maxAge: Number,
    healthConditions: [String],
    contraindications: [String],
    requiredDocuments: [String]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total duration string
packageSchema.virtual('durationString').get(function() {
  return `${this.duration.days} days, ${this.duration.nights} nights`;
});

// Virtual for availability status
packageSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.isActive && 
         this.availability.currentBookings < this.availability.maxCapacity &&
         (!this.availability.startDate || this.availability.startDate <= now) &&
         (!this.availability.endDate || this.availability.endDate >= now);
});

// Virtual for discounted price
packageSchema.virtual('discountedPrice').get(function() {
  const now = new Date();
  const activeDiscount = this.pricing.discounts.find(discount => 
    !discount.validUntil || discount.validUntil >= now
  );
  
  if (activeDiscount) {
    return this.pricing.basePrice * (1 - activeDiscount.percentage / 100);
  }
  
  return this.pricing.basePrice;
});

// Indexes for better performance
packageSchema.index({ category: 1, isActive: 1 });
packageSchema.index({ 'location.city': 1, 'location.country': 1 });
packageSchema.index({ 'pricing.basePrice': 1 });
packageSchema.index({ 'rating.average': -1 });
packageSchema.index({ createdAt: -1 });
packageSchema.index({ isFeatured: -1, 'rating.average': -1 });

// Text index for search
packageSchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'medicalFacility.name': 'text',
  tags: 'text'
});

// Update rating when reviews change
packageSchema.methods.calculateAverageRating = async function() {
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    {
      $match: { package: this._id }
    },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.rating.average = Math.round(stats[0].averageRating * 10) / 10;
    this.rating.count = stats[0].numOfReviews;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }

  await this.save();
};

module.exports = mongoose.model('Package', packageSchema);
