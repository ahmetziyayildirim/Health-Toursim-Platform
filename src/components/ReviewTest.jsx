import React, { useState, useEffect } from 'react';
import ReviewsList from './ReviewsList';
import StarRating from './StarRating';
import api from '../services/api';

const ReviewTest = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/packages');
      setPackages(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedPackage(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No packages found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Review System Test
          </h1>
          <p className="text-gray-600 mt-1">
            Testing the complete review functionality
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Package
              </h2>
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg._id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPackage._id === pkg._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      {pkg.title}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating 
                        rating={pkg.rating?.average || 0} 
                        size="sm" 
                        showNumber={true}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.rating?.count || 0} review{pkg.rating?.count !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Package Details & Reviews */}
          <div className="lg:col-span-2">
            {/* Package Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <img
                  src={selectedPackage.images?.[0] || 'https://via.placeholder.com/150x100'}
                  alt={selectedPackage.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedPackage.title}
                  </h2>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {selectedPackage.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <StarRating 
                      rating={selectedPackage.rating?.average || 0} 
                      size="md" 
                      showNumber={true}
                    />
                    <span className="text-lg font-bold text-blue-600">
                      €{selectedPackage.pricing?.basePrice}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedPackage.location?.city}, {selectedPackage.location?.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsList 
              packageId={selectedPackage._id}
              packageData={selectedPackage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTest;
