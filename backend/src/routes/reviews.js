const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams for /:packageId/reviews
const Review = require('../models/Review');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @desc    Get reviews for a package
// @route   GET /api/packages/:packageId/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sort = '-createdAt', rating, limit = 10, page = 1 } = req.query;
    
    let query = { package: req.params.packageId };
    
    if (rating) {
      query.rating = Number(rating);
    }

    const reviews = await Review.find(query)
      .populate({
        path: 'user',
        select: 'firstName lastName'
      })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @desc    Create new review
// @route   POST /api/packages/:packageId/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const packageId = req.params.packageId;
    const userId = req.user.id;

    // Check if package exists
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check if user already reviewed this package
    const existingReview = await Review.findOne({
      package: packageId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this package'
      });
    }

    // Check if user has booking for this package (for verification)
    const hasBooking = await Booking.findOne({
      package: packageId,
      user: userId,
      status: { $in: ['confirmed', 'completed'] }
    });

    const review = await Review.create({
      rating,
      title,
      comment,
      user: userId,
      package: packageId,
      isVerified: !!hasBooking
    });

    await review.populate({
      path: 'user',
      select: 'firstName lastName'
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (own review only)
router.put('/:id', protect, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'user',
      select: 'firstName lastName'
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (own review only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

// @desc    Vote review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    if (review.votedUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this review'
      });
    }

    review.helpfulVotes += 1;
    review.votedUsers.push(req.user.id);
    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error voting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting review'
    });
  }
});

module.exports = router;
