import React, { useState, useEffect } from 'react';
import { packageAPI } from '../services/api';

const PackageTest = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        console.log('PackageTest: Starting to load packages...');
        setLoading(true);
        setError(null);
        
        const response = await packageAPI.getAllPackages();
        console.log('PackageTest: API Response:', response);
        
        if (response.success) {
          console.log('PackageTest: Setting packages:', response.data.length, 'packages');
          setPackages(response.data);
        } else {
          console.error('PackageTest: API response not successful:', response);
          setError('API response not successful');
        }
      } catch (error) {
        console.error('PackageTest: Failed to load packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        console.log('PackageTest: Loading finished');
      }
    };

    loadPackages();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Package Test - Loading...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Package Test - Error</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Package Test - Success</h2>
      <p className="mb-4">Loaded {packages.length} packages:</p>
      
      <div className="grid gap-4">
        {packages.map((pkg, index) => (
          <div key={pkg._id || index} className="border border-gray-300 rounded-lg p-4">
            <h3 className="font-bold text-lg">{pkg.title}</h3>
            <p className="text-gray-600">{pkg.location.city}, {pkg.location.country}</p>
            <p className="text-blue-600 font-semibold">€{pkg.pricing.basePrice}</p>
            <p className="text-sm text-gray-500">Category: {pkg.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageTest;
