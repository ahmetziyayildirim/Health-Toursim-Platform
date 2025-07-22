import { adminAPI, packageAPI, bookingAPI, userAPI, statsAPI } from './api.js';

class AdminService {
  // Dashboard stats
  async getDashboardStats() {
    try {
      return await adminAPI.getDashboardStats();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  // User management
  async getUsers(filters = {}) {
    try {
      return await adminAPI.getAllUsers(filters);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      return await adminAPI.getUser(userId);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      return await adminAPI.updateUser(userId, userData);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      return await adminAPI.updateUser(userId, { role });
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      return await adminAPI.deleteUser(userId);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Booking management
  async getBookings(filters = {}) {
    try {
      return await adminAPI.getAllBookingsAdmin(filters);
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      return await bookingAPI.updateBookingStatus(bookingId, status);
    } catch (error) {
      console.error('Update booking status error:', error);
      throw error;
    }
  }

  async updateBooking(bookingId, bookingData) {
    try {
      return await bookingAPI.updateBooking(bookingId, bookingData);
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  }

  async deleteBooking(bookingId) {
    try {
      return await bookingAPI.deleteBooking(bookingId);
    } catch (error) {
      console.error('Delete booking error:', error);
      throw error;
    }
  }

  // Bulk booking operations
  async bulkUpdateBookings(bookingIds, updateData) {
    try {
      return await adminAPI.bulkUpdateBookings(bookingIds, updateData);
    } catch (error) {
      console.error('Bulk update bookings error:', error);
      throw error;
    }
  }

  async bulkDeleteBookings(bookingIds) {
    try {
      return await adminAPI.bulkDeleteBookings(bookingIds);
    } catch (error) {
      console.error('Bulk delete bookings error:', error);
      throw error;
    }
  }

  // Package management (admin functions)
  async getPackages(filters = {}) {
    try {
      return await adminAPI.getAllPackagesAdmin(filters);
    } catch (error) {
      console.error('Get packages error:', error);
      throw error;
    }
  }

  async createPackage(packageData) {
    try {
      return await packageAPI.createPackage(packageData);
    } catch (error) {
      console.error('Create package error:', error);
      throw error;
    }
  }

  async updatePackage(packageId, packageData) {
    try {
      return await packageAPI.updatePackage(packageId, packageData);
    } catch (error) {
      console.error('Update package error:', error);
      throw error;
    }
  }

  async deletePackage(packageId) {
    try {
      return await packageAPI.deletePackage(packageId);
    } catch (error) {
      console.error('Delete package error:', error);
      throw error;
    }
  }

  // Review management
  async getReviews(filters = {}) {
    try {
      return await adminAPI.getAllReviewsAdmin(filters);
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  }

  // Analytics and statistics
  async getAnalytics(type, period = '30d') {
    try {
      return await adminAPI.getAnalytics(type, period);
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  async getOverallStats() {
    try {
      return await statsAPI.getOverallStats();
    } catch (error) {
      console.error('Get overall stats error:', error);
      throw error;
    }
  }

  async getBookingTrends(period = '30d') {
    try {
      return await statsAPI.getBookingTrends(period);
    } catch (error) {
      console.error('Get booking trends error:', error);
      throw error;
    }
  }

  async getRevenueStats(period = '30d') {
    try {
      return await statsAPI.getRevenueStats(period);
    } catch (error) {
      console.error('Get revenue stats error:', error);
      throw error;
    }
  }

  async getPopularDestinations() {
    try {
      return await statsAPI.getPopularDestinations();
    } catch (error) {
      console.error('Get popular destinations error:', error);
      throw error;
    }
  }

  async getCustomerSatisfaction() {
    try {
      return await statsAPI.getCustomerSatisfaction();
    } catch (error) {
      console.error('Get customer satisfaction error:', error);
      throw error;
    }
  }

  // System management
  async getSystemInfo() {
    try {
      return await adminAPI.getSystemInfo();
    } catch (error) {
      console.error('Get system info error:', error);
      throw error;
    }
  }

  // Utility methods for commonly used operations
  async searchUsers(query) {
    try {
      return await this.getUsers({ search: query });
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  async getActiveBookings() {
    try {
      return await this.getBookings({ status: 'confirmed' });
    } catch (error) {
      console.error('Get active bookings error:', error);
      throw error;
    }
  }

  async getPendingBookings() {
    try {
      return await this.getBookings({ status: 'pending' });
    } catch (error) {
      console.error('Get pending bookings error:', error);
      throw error;
    }
  }

  async getFeaturedPackages() {
    try {
      return await this.getPackages({ featured: true });
    } catch (error) {
      console.error('Get featured packages error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService;

// Named exports for specific functions
export const {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getBookings,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  bulkUpdateBookings,
  bulkDeleteBookings,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getReviews,
  getAnalytics,
  getOverallStats,
  getBookingTrends,
  getRevenueStats,
  getPopularDestinations,
  getCustomerSatisfaction,
  getSystemInfo,
  searchUsers,
  getActiveBookings,
  getPendingBookings,
  getFeaturedPackages
} = adminService;
