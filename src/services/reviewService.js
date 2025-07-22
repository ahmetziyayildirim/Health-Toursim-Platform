import { reviewAPI } from './api';

const reviewService = {
  // Get all reviews with filters
  getAllReviews: async (filters = {}) => {
    try {
      return await reviewAPI.getReviews(filters);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get reviews for a specific package
  getPackageReviews: async (packageId, filters = {}) => {
    try {
      return await reviewAPI.getPackageReviews(packageId, filters);
    } catch (error) {
      console.error('Error fetching package reviews:', error);
      throw error;
    }
  },

  // Get single review
  getReview: async (reviewId) => {
    try {
      return await reviewAPI.getReview(reviewId);
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  // Create a new review
  createReview: async (reviewData) => {
    try {
      return await reviewAPI.createReview(reviewData);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      return await reviewAPI.updateReview(reviewId, reviewData);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      return await reviewAPI.deleteReview(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get review statistics
  getReviewStats: async () => {
    try {
      return await reviewAPI.getReviewStats();
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  },

  // Get featured reviews
  getFeaturedReviews: async () => {
    try {
      return await reviewAPI.getFeaturedReviews();
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      throw error;
    }
  },

  // Utility methods for better user experience
  getReviewsByRating: async (packageId, rating) => {
    try {
      return await reviewAPI.getPackageReviews(packageId, { rating });
    } catch (error) {
      console.error('Error fetching reviews by rating:', error);
      throw error;
    }
  },

  getRecentReviews: async (packageId, limit = 5) => {
    try {
      return await reviewAPI.getPackageReviews(packageId, { 
        sort: '-createdAt', 
        limit 
      });
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  },

  getMostHelpfulReviews: async (packageId, limit = 5) => {
    try {
      return await reviewAPI.getPackageReviews(packageId, { 
        sort: '-helpfulCount', 
        limit 
      });
    } catch (error) {
      console.error('Error fetching most helpful reviews:', error);
      throw error;
    }
  },

  // Vote a review as helpful (if backend supports this)
  voteHelpful: async (reviewId) => {
    try {
      // This would need to be implemented in the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to vote for review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error voting review:', error);
      throw error;
    }
  },

  // Report a review (if backend supports this)
  reportReview: async (reviewId, reason) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to report review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reporting review:', error);
      throw error;
    }
  }
};

export default reviewService;
