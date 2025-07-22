import apiService, { authAPI, userAPI } from './api.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.initializeAuth();
  }

  // Initialize authentication state from localStorage
  initializeAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        this.currentUser = JSON.parse(user);
        this.isAuthenticated = true;
        apiService.setToken(token);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  // Register a new user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success) {
        this.handleAuthSuccess(response);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.success) {
        this.handleAuthSuccess(response);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated) {
        await apiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      this.handleLogout();
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.get('/auth/me');
      
      if (response.success) {
        this.currentUser = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error(response.message || 'Failed to get user profile');
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, logout
      if (error.message.includes('Token') || error.message.includes('401')) {
        this.logout();
      }
      throw error;
    }
  }

  // Update user details
  async updateProfile(userData) {
    try {
      const response = await apiService.put('/auth/updatedetails', userData);
      
      if (response.success) {
        this.currentUser = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Update user password
  async updatePassword(passwordData) {
    try {
      const response = await apiService.put('/auth/updatepassword', passwordData);
      
      if (response.success) {
        // Password update returns new token
        this.handleAuthSuccess(response);
        return response;
      }
      
      throw new Error(response.message || 'Password update failed');
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await apiService.put('/auth/preferences', preferences);
      
      if (response.success) {
        this.currentUser = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error(response.message || 'Preferences update failed');
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgotpassword', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await apiService.put(`/auth/resetpassword/${token}`, { password });
      
      if (response.success) {
        this.handleAuthSuccess(response);
        return response;
      }
      
      throw new Error(response.message || 'Password reset failed');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Handle successful authentication
  handleAuthSuccess(response) {
    // Backend returns response.data.token and response.data.user
    const { token, user } = response.data || response;
    
    this.currentUser = user;
    this.isAuthenticated = true;
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set token in API service
    apiService.setToken(token);
  }

  // Handle logout
  handleLogout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear token from API service
    apiService.setToken(null);
  }

  // Check if user is authenticated
  isLoggedIn() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get current user
  getUser() {
    return this.currentUser;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Get user preferences
  getPreferences() {
    return this.currentUser?.preferences || {
      budget: 1000,
      dateRange: 'flexible',
      experiences: [],
      services: []
    };
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;

// Export the class for testing
export { AuthService };
