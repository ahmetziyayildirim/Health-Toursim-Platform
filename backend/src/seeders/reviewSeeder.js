const Review = require('../models/Review');
const Package = require('../models/Package');
const User = require('../models/User');

const sampleReviews = [
  {
    rating: 5,
    title: "Amazing Experience!",
    comment: "This hair transplant package exceeded all my expectations. The clinic was world-class, the doctors were extremely professional, and the results are fantastic. The hotel accommodation was luxurious and the city tour was a nice bonus. Highly recommended!"
  },
  {
    rating: 4,
    title: "Great Value for Money",
    comment: "Overall very satisfied with the service. The procedure went smoothly and the staff was very caring. The only minor issue was the language barrier with some staff members, but the main doctor spoke perfect English."
  },
  {
    rating: 5,
    title: "Professional and Caring",
    comment: "From the moment I arrived until I left, everything was perfectly organized. The medical team was highly skilled and made me feel comfortable throughout the entire process. The recovery support was excellent."
  },
  {
    rating: 4,
    title: "Good Results, Beautiful Location",
    comment: "The dental work was excellent and completed faster than expected. Istanbul is a beautiful city and the accommodation was great. Would definitely recommend this package to others."
  },
  {
    rating: 5,
    title: "Life-changing Experience",
    comment: "This cosmetic surgery package changed my life. The surgeon was incredibly skilled and the results are natural-looking. The aftercare service was outstanding and the price was very reasonable compared to my home country."
  },
  {
    rating: 4,
    title: "Relaxing and Rejuvenating",
    comment: "The spa retreat was exactly what I needed. The thermal waters were amazing and the wellness treatments were top-notch. The only thing I wished for was a longer stay!"
  },
  {
    rating: 5,
    title: "Exceeded Expectations",
    comment: "The eye surgery went perfectly and my vision is now better than ever. The clinic was modern and clean, and the medical team was very experienced. The price included everything as promised."
  },
  {
    rating: 3,
    title: "Average Experience",
    comment: "The medical procedure was fine and the doctor was competent. However, the hotel could have been better and some of the promised services were not available. It was okay but not exceptional."
  }
];

const seedReviews = async () => {
  try {
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Get some packages and users
    const packages = await Package.find().limit(6);
    const users = await User.find({ role: 'user' }).limit(10);

    if (packages.length === 0) {
      console.log('❌ No packages found. Please seed packages first.');
      return [];
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      return [];
    }

    const reviews = [];
    
    // Create reviews for packages
    for (let i = 0; i < Math.min(packages.length, sampleReviews.length); i++) {
      const packageItem = packages[i];
      
      // Create 1-3 reviews per package
      const reviewCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < reviewCount && j < users.length; j++) {
        const reviewData = sampleReviews[(i + j) % sampleReviews.length];
        const user = users[j % users.length];
        
        // Check if this user already reviewed this package
        const existingReview = await Review.findOne({
          package: packageItem._id,
          user: user._id
        });
        
        if (!existingReview) {
          const review = await Review.create({
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            user: user._id,
            package: packageItem._id,
            isVerified: Math.random() > 0.3 // 70% chance of being verified
          });
          
          reviews.push(review);
        }
      }
    }

    console.log(`✅ Created ${reviews.length} reviews`);
    
    // The calcAverageRating will be called automatically by the post-save middleware
    console.log('📊 Package ratings updated automatically');
    
    return reviews;
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  }
};

module.exports = { seedReviews };
