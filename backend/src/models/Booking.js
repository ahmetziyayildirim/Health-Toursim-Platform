const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: [true, 'Booking must be for a package']
  },
  bookingNumber: {
    type: String,
    unique: true,
    required: false
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    passportNumber: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  healthInfo: {
    conditions: String,
    allergies: String,
    medications: String,
    specialRequirements: String,
    previousSurgeries: String,
    currentSymptoms: String
  },
  travelDates: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    flexibility: {
      type: String,
      enum: ['exact', 'flexible-1week', 'flexible-2weeks', 'flexible-1month'],
      default: 'exact'
    }
  },
  travelers: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least one adult is required'],
      default: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  selectedServices: [{
    serviceId: String,
    name: String,
    included: Boolean,
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  accommodation: {
    roomType: String,
    roomPreference: String,
    specialRequests: String
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    additionalServices: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'EUR'
    },
    paymentPlan: {
      type: String,
      enum: ['full-payment', 'deposit-balance', 'installments'],
      default: 'deposit-balance'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit-card', 'bank-transfer', 'paypal', 'stripe']
    },
    transactions: [{
      transactionId: String,
      amount: Number,
      currency: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded']
      },
      paymentMethod: String,
      processedAt: Date,
      refundedAt: Date,
      refundAmount: Number
    }],
    depositAmount: Number,
    depositPaidAt: Date,
    balanceAmount: Number,
    balanceDueDate: Date,
    balancePaidAt: Date
  },
  status: {
    type: String,
    enum: [
      'pending-confirmation',
      'confirmed',
      'payment-pending',
      'payment-completed',
      'documents-required',
      'documents-received',
      'pre-travel-consultation',
      'travel-ready',
      'in-progress',
      'completed',
      'cancelled',
      'refunded'
    ],
    default: 'pending-confirmation'
  },
  documents: [{
    type: {
      type: String,
      enum: ['passport', 'medical-report', 'insurance', 'visa', 'other']
    },
    name: String,
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],
  communications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'whatsapp', 'system']
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound']
    },
    subject: String,
    message: String,
    sentBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  medicalAppointments: [{
    type: {
      type: String,
      enum: ['consultation', 'treatment', 'surgery', 'follow-up', 'check-up']
    },
    doctor: String,
    facility: String,
    scheduledDate: Date,
    duration: Number, // in minutes
    notes: String,
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    }
  }],
  itinerary: [{
    day: Number,
    date: Date,
    activities: [String],
    appointments: [String],
    accommodation: String,
    meals: [String],
    notes: String
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewDate: Date,
    wouldRecommend: Boolean,
    improvements: String
  },
  cancellation: {
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    refundAmount: Number,
    refundProcessedAt: Date,
    cancellationFee: Number
  },
  assignedCoordinator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['payment', 'documents', 'appointment', 'travel', 'follow-up']
    },
    message: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total travelers
bookingSchema.virtual('totalTravelers').get(function() {
  return this.travelers.adults + this.travelers.children + this.travelers.infants;
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.travelDates.startDate && this.travelDates.endDate) {
    const diffTime = Math.abs(this.travelDates.endDate - this.travelDates.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual for payment completion percentage
bookingSchema.virtual('paymentProgress').get(function() {
  if (this.pricing.totalPrice === 0) return 100;
  
  const paidAmount = this.payment.transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return Math.round((paidAmount / this.pricing.totalPrice) * 100);
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ package: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'travelDates.startDate': 1 });
bookingSchema.index({ 'payment.status': 1 });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingNumber = `HT${year}${month}${random}`;
  }
  next();
});

// Calculate total price before saving
bookingSchema.pre('save', function(next) {
  this.pricing.totalPrice = 
    this.pricing.basePrice + 
    this.pricing.additionalServices + 
    this.pricing.taxes - 
    this.pricing.discounts;
  next();
});

// Update package booking count
bookingSchema.post('save', async function() {
  if (this.status === 'confirmed' || this.status === 'payment-completed') {
    await mongoose.model('Package').findByIdAndUpdate(
      this.package,
      { $inc: { 'availability.currentBookings': 1 } }
    );
  }
});

// Decrease package booking count on cancellation
bookingSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'cancelled') {
    await mongoose.model('Package').findByIdAndUpdate(
      doc.package,
      { $inc: { 'availability.currentBookings': -1 } }
    );
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
