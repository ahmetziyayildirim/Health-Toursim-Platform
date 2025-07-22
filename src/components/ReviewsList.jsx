import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';

const ReviewsList = ({ packageId, packageData }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filters, setFilters] = useState({
    sort: '-createdAt',
    rating: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [packageId, filters]);

  useEffect(() => {
    // Check if current user has already reviewed this package
    if (user && reviews.length > 0) {
      const existingReview = reviews.find(review => review.user._id === user._id);
      setUserReview(existingReview);
    }
  }, [user, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getPackageReviews(packageId, filters);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (newReview) => {
    if (editingReview) {
      // Update existing review
      setReviews(prev => prev.map(review => 
        review._id === editingReview._id ? newReview : review
      ));
      setEditingReview(null);
    } else {
      // Add new review
      setReviews(prev => [newReview, ...prev]);
      setUserReview(newReview);
    }
    setShowForm(false);
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews(prev => prev.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review._id !== reviewId));
    if (userReview && userReview._id === reviewId) {
      setUserReview(null);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowForm(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getRatingStats = () => {
    if (!packageData?.rating) return null;
    
    return {
      average: packageData.rating.average || 0,
      count: packageData.rating.count || 0
    };
  };

  const ratingStats = getRatingStats();

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        
        {ratingStats && (
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {ratingStats.average}
              </div>
              <StarRating rating={ratingStats.average} size="lg" showNumber={false} />
              <div className="text-sm text-gray-600 mt-1">
                {ratingStats.count} review{ratingStats.count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {user && !userReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        )}

        {/* Edit Review Button */}
        {user && userReview && !showForm && (
          <button
            onClick={() => handleEditReview(userReview)}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Edit Your Review
          </button>
        )}

        {/* Login Message */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Please <span className="font-semibold">login</span> to write a review.
            </p>
          </div>
        )}
      </div>

      {/* Review Form */}
      <ReviewForm
        packageId={packageId}
        editingReview={editingReview}
        onSubmit={handleReviewSubmit}
        onCancel={handleCancelEdit}
        isVisible={showForm}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-rating">Highest Rating</option>
              <option value="rating">Lowest Rating</option>
              <option value="-helpfulVotes">Most Helpful</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onUpdate={handleReviewUpdate}
                onDelete={handleReviewDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <p className="text-gray-600">
              {filters.rating ? 
                `No reviews found with ${filters.rating} star${filters.rating !== '1' ? 's' : ''}.` :
                'No reviews yet. Be the first to review this package!'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
