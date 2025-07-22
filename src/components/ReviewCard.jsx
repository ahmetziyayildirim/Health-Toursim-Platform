import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';

const ReviewCard = ({ review, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [localReview, setLocalReview] = useState(review);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpfulVote = async () => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    if (isVoting) return;

    try {
      setIsVoting(true);
      const response = await reviewService.voteHelpful(review._id);
      setLocalReview(response.data);
      if (onUpdate) onUpdate(response.data);
    } catch (error) {
      console.error('Error voting for review:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.deleteReview(review._id);
      if (onDelete) onDelete(review._id);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const isOwnReview = user && user._id === review.user._id;
  const hasVoted = localReview.votedUsers?.includes(user?._id);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.firstName} {review.user?.lastName}
            </h4>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
              {review.isVerified && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwnReview && (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate && onUpdate(review)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={handleHelpfulVote}
          disabled={isVoting || hasVoted || isOwnReview}
          className={`flex items-center gap-2 text-sm ${
            hasVoted 
              ? 'text-green-600' 
              : isOwnReview
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-green-600'
          } transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>
            {hasVoted ? 'Voted Helpful' : 'Helpful'} ({localReview.helpfulVotes || 0})
          </span>
        </button>

        {review.updatedAt !== review.createdAt && (
          <span className="text-xs text-gray-500">
            Updated {formatDate(review.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
