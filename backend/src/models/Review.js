const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false // Will be true if user has booking for this package
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  votedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ package: 1, user: 1 }, { unique: true }); // One review per user per package
reviewSchema.index({ package: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

// Middleware to update package rating after review save/update/delete
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating(this.package);
});

reviewSchema.post('remove', async function() {
  await this.constructor.calcAverageRating(this.package);
});

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(packageId) {
  const obj = await this.aggregate([
    {
      $match: { package: packageId }
    },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Package').findByIdAndUpdate(packageId, {
      'rating.average': obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      'rating.count': obj[0] ? obj[0].reviewCount : 0
    });
  } catch (error) {
    console.error('Error updating package rating:', error);
  }
};

module.exports = mongoose.model('Review', reviewSchema);
