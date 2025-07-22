// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log('API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get response text first
      const responseText = await response.text();
      console.log('API Response text:', responseText);
      
      // Check if response is empty
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      // Check if response is ok after parsing
      if (!response.ok) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Package API methods
export const packageAPI = {
  // Get all packages with filters
  getPackages: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/packages${queryString ? `?${queryString}` : ''}`);
  },

  // Get all packages (alias for getPackages with no filters)
  getAllPackages: () => {
    return apiService.get('/packages');
  },

  // Get featured packages
  getFeaturedPackages: () => {
    return apiService.get('/packages/featured/list');
  },

  // Get single package
  getPackage: (id) => {
    return apiService.get(`/packages/${id}`);
  },

  // Create package (admin only)
  createPackage: (packageData) => {
    return apiService.post('/packages', packageData);
  },

  // Update package (admin only)
  updatePackage: (id, packageData) => {
    return apiService.put(`/packages/${id}`, packageData);
  },

  // Delete package (admin only)
  deletePackage: (id) => {
    return apiService.delete(`/packages/${id}`);
  }
};

// Auth API methods
export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  getProfile: () => apiService.get('/auth/profile'),
  updateProfile: (userData) => apiService.put('/auth/profile', userData)
};

// Booking API methods
export const bookingAPI = {
  // Get all bookings with filters
  getBookings: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Get all bookings
  getAllBookings: () => {
    return apiService.get('/bookings');
  },

  // Get single booking
  getBooking: (id) => {
    return apiService.get(`/bookings/${id}`);
  },

  // Create booking
  createBooking: (bookingData) => {
    return apiService.post('/bookings', bookingData);
  },

  // Update booking
  updateBooking: (id, bookingData) => {
    return apiService.put(`/bookings/${id}`, bookingData);
  },

  // Update booking status
  updateBookingStatus: (id, status) => {
    return apiService.patch(`/bookings/${id}/status`, { status });
  },

  // Delete booking
  deleteBooking: (id) => {
    return apiService.delete(`/bookings/${id}`);
  },

  // Get booking statistics
  getBookingStats: () => {
    return apiService.get('/bookings/stats/overview');
  }
};

export default apiService;

// Review API methods
export const reviewAPI = {
  // Get all reviews with filters
  getReviews: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Get reviews for a specific package
  getPackageReviews: (packageId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/packages/${packageId}/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Get single review
  getReview: (id) => {
    return apiService.get(`/reviews/${id}`);
  },

  // Create review
  createReview: (reviewData) => {
    const { packageId, ...reviewBody } = reviewData;
    return apiService.post(`/packages/${packageId}/reviews`, reviewBody);
  },

  // Update review
  updateReview: (id, reviewData) => {
    return apiService.put(`/reviews/${id}`, reviewData);
  },

  // Delete review
  deleteReview: (id) => {
    return apiService.delete(`/reviews/${id}`);
  },

  // Get review statistics
  getReviewStats: () => {
    return apiService.get('/reviews/stats/overview');
  },

  // Get featured reviews
  getFeaturedReviews: () => {
    return apiService.get('/reviews/featured');
  }
};

// Admin API methods
export const adminAPI = {
  // Dashboard statistics
  getDashboardStats: () => {
    return apiService.get('/admin/dashboard');
  },

  // User management
  getAllUsers: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUser: (id) => {
    return apiService.get(`/admin/users/${id}`);
  },

  updateUser: (id, userData) => {
    return apiService.put(`/admin/users/${id}`, userData);
  },

  deleteUser: (id) => {
    return apiService.delete(`/admin/users/${id}`);
  },

  // Package management (admin-specific methods)
  getAllPackagesAdmin: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/packages/admin/all${queryString ? `?${queryString}` : ''}`);
  },

  // Booking management (admin-specific methods)
  getAllBookingsAdmin: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Review management (admin-specific methods)
  getAllReviewsAdmin: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Analytics
  getAnalytics: (type, period = '30d') => {
    return apiService.get(`/admin/analytics/${type}?period=${period}`);
  },

  // System management
  getSystemInfo: () => {
    return apiService.get('/admin/system/info');
  },

  // Bulk operations
  bulkUpdateBookings: (bookingIds, updateData) => {
    return apiService.post('/admin/bookings/bulk-update', { bookingIds, updateData });
  },

  bulkDeleteBookings: (bookingIds) => {
    return apiService.post('/admin/bookings/bulk-delete', { bookingIds });
  }
};

// User API methods
export const userAPI = {
  // Get current user's bookings
  getUserBookings: () => {
    return apiService.get('/users/my-bookings');
  },

  // Get current user's reviews
  getUserReviews: () => {
    return apiService.get('/users/my-reviews');
  },

  // Update profile
  updateProfile: (userData) => {
    return apiService.put('/users/profile', userData);
  },

  // Change password
  changePassword: (passwordData) => {
    return apiService.post('/users/change-password', passwordData);
  },

  // Upload profile image
  uploadProfileImage: (formData) => {
    return apiService.request('/users/profile-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiService.token}`
      }
    });
  },

  // Get user preferences
  getPreferences: () => {
    return apiService.get('/users/preferences');
  },

  // Update user preferences
  updatePreferences: (preferences) => {
    return apiService.put('/users/preferences', preferences);
  }
};

// Statistics API methods
export const statsAPI = {
  // General statistics
  getOverallStats: () => {
    return apiService.get('/stats/overview');
  },

  // Package statistics
  getPackageStats: (packageId) => {
    return apiService.get(`/stats/packages/${packageId}`);
  },

  // Booking trends
  getBookingTrends: (period = '30d') => {
    return apiService.get(`/stats/bookings/trends?period=${period}`);
  },

  // Revenue statistics
  getRevenueStats: (period = '30d') => {
    return apiService.get(`/stats/revenue?period=${period}`);
  },

  // Popular destinations
  getPopularDestinations: () => {
    return apiService.get('/stats/destinations/popular');
  },

  // Customer satisfaction
  getCustomerSatisfaction: () => {
    return apiService.get('/stats/satisfaction');
  }
};

// Search API methods
export const searchAPI = {
  // Search packages
  searchPackages: (query, filters = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    return apiService.get(`/search/packages?${queryParams.toString()}`);
  },

  // Search suggestions
  getSearchSuggestions: (query) => {
    return apiService.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  // Advanced search
  advancedSearch: (searchCriteria) => {
    return apiService.post('/search/advanced', searchCriteria);
  }
};

// Notification API methods
export const notificationAPI = {
  // Get notifications
  getNotifications: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiService.get(`/notifications${queryString ? `?${queryString}` : ''}`);
  },

  // Mark notification as read
  markAsRead: (id) => {
    return apiService.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiService.patch('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (id) => {
    return apiService.delete(`/notifications/${id}`);
  },

  // Get unread count
  getUnreadCount: () => {
    return apiService.get('/notifications/unread-count');
  }
};

// Export the class for testing or multiple instances
export { ApiService };
