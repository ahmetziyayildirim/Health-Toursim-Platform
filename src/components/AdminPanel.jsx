import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Heart,
  LogOut,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Packages management state
  const [packages, setPackages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: { city: '', country: '' },
    category: '',
    experienceTypes: [],
    services: [],
    accommodation: {
      name: '',
      type: 'hotel',
      starRating: 3,
      amenities: [],
      roomType: ''
    },
    medicalFacility: {
      name: '',
      type: 'medical-center',
      accreditations: [],
      specializations: [],
      doctors: []
    },
    pricing: {
      includes: {
        flights: false,
        accommodation: true,
        meals: 'breakfast',
        transfers: true
      },
      discounts: []
    },
    itinerary: [],
    requirements: {
      minAge: '',
      maxAge: '',
      healthConditions: [],
      contraindications: [],
      requiredDocuments: []
    },
    availability: {
      startDate: '',
      endDate: '',
      maxCapacity: 10
    },
    images: [],
    isFeatured: false,
    tags: [],
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  // Bookings management state
  const [bookings, setBookings] = useState([]);

  // Users management state
  const [users, setUsers] = useState([]);

  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalBookings: 0,
    activePackages: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  const loadPackages = React.useCallback(async () => {
    try {
      console.log('Loading packages via admin endpoint...');
      const response = await fetch('http://localhost:5001/api/packages/admin/all');
      console.log('Admin packages response status:', response.status);
      const data = await response.json();
      console.log('Admin packages response data:', data);
      if (data.success) {
        console.log('Setting admin packages:', data.data);
        setPackages(data.data);
      } else {
        console.error('Admin packages API returned success: false');
      }
    } catch (error) {
      console.error('Failed to load admin packages:', error);
    }
  }, []);

      const loadBookings = React.useCallback(async () => {
    try {
      console.log('Loading bookings...');
      const response = await fetch('http://localhost:5001/api/bookings');
      console.log('Bookings response status:', response.status);
      const data = await response.json();
      console.log('Bookings response data:', data);
      if (data.success) {
        console.log('Setting bookings:', data.data);
        setBookings(data.data);
      } else {
        console.error('Bookings API returned success: false');
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  }, []);

  const loadUsers = React.useCallback(async () => {
    try {
      console.log('Loading users via admin API...');
      const adminService = (await import('../services/adminService')).default;
      const data = await adminService.getUsers();
      console.log('Admin users response data:', data);
      if (data.success) {
        console.log('Setting users:', data.data);
        setUsers(data.data);
      } else {
        console.error('Admin users API returned success: false');
      }
    } catch (error) {
      console.error('Failed to load users via admin API:', error);
      // Fallback to regular API for demo
      try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
    }
  }, []);

  // Load packages when switching to packages view
  React.useEffect(() => {
    if (currentView === 'packages' && user) {
      loadPackages();
    }
  }, [currentView, user, loadPackages]);

  // Load bookings when switching to bookings view
  React.useEffect(() => {
    if (currentView === 'bookings' && user) {
      loadBookings();
    }
  }, [currentView, user, loadBookings]);

  // Load users when switching to users view
  React.useEffect(() => {
    if (currentView === 'users' && user) {
      loadUsers();
    }
  }, [currentView, user, loadUsers]);

  // Load dashboard data when switching to dashboard view
  const loadDashboardData = React.useCallback(async () => {
    try {
      console.log('Loading dashboard data...');
      
      // Load all data in parallel - use admin endpoint for packages to get all packages including inactive ones
      const [usersRes, packagesRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5001/api/users'),
        fetch('http://localhost:5001/api/packages/admin/all'), // Admin endpoint to get all packages
        fetch('http://localhost:5001/api/bookings')
      ]);

      const [usersData, packagesData, bookingsData] = await Promise.all([
        usersRes.json(),
        packagesRes.json(),
        bookingsRes.json()
      ]);

      console.log('Dashboard data loaded:', { usersData, packagesData, bookingsData });

      // Update stats
      if (usersData.success && packagesData.success && bookingsData.success) {
        setDashboardStats({
          totalUsers: usersData.data.length,
          totalPackages: packagesData.data.length, // This will now include inactive packages
          totalBookings: bookingsData.data.length,
          activePackages: packagesData.data.filter(pkg => pkg.isActive !== false).length // Count active packages
        });

        // Set recent users (last 3)
        const sortedUsers = usersData.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentUsers(sortedUsers);

        // Set recent bookings (last 3)
        const sortedBookings = bookingsData.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentBookings(sortedBookings);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, []);

  React.useEffect(() => {
    if (currentView === 'dashboard' && user) {
      loadDashboardData();
    }
  }, [currentView, user, loadDashboardData]);

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting new package:', newPackage);
      
      // Format the package data to match the backend schema
      const packageData = {
        title: newPackage.title,
        description: newPackage.description,
        category: newPackage.category,
        pricing: {
          basePrice: parseInt(newPackage.price),
          currency: 'EUR'
        },
        duration: {
          days: parseInt(newPackage.duration.split(' ')[0]) || 1,
          nights: parseInt(newPackage.duration.split(' ')[0]) - 1 || 0
        },
        location: {
          city: newPackage.location.city,
          country: newPackage.location.country
        },
        medicalFacility: {
          name: `${newPackage.location.city} Medical Center`,
          type: 'medical-center'
        },
        experienceTypes: ['Treatment-Focused'],
        services: [
          {
            name: 'Doctor Consultation',
            description: 'Medical consultation',
            included: true,
            additionalCost: 0
          }
        ],
        isActive: newPackage.isActive !== false,
        isFeatured: false,
        tags: [newPackage.category]
      };

      console.log('Formatted package data:', packageData);

      const response = await fetch('http://localhost:5001/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });
      
      const result = await response.json();
      console.log('Add package response:', result);
      
      if (response.ok) {
        setShowAddForm(false);
        setNewPackage({
          title: '',
          description: '',
          price: '',
          duration: '',
          location: { city: '', country: '' },
          category: '',
          features: [],
          image: ''
        });
        loadPackages();
        alert('Package added successfully!');
      } else {
        console.error('Failed to add package:', result);
        alert('Failed to add package: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to add package:', error);
      alert('Failed to add package: ' + error.message);
    }
  };

  const handleEditPackage = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating package:', editingPackage);
      
      // Format the package data to match the backend schema
      const packageData = {
        title: editingPackage.title,
        description: editingPackage.description,
        category: editingPackage.category,
        pricing: {
          basePrice: editingPackage.pricing?.basePrice || parseInt(editingPackage.price) || 0,
          currency: 'EUR'
        },
        duration: {
          days: parseInt(editingPackage.durationString?.split(' ')[0]) || editingPackage.duration?.days || 1,
          nights: (parseInt(editingPackage.durationString?.split(' ')[0]) || editingPackage.duration?.days || 1) - 1
        },
        location: {
          city: editingPackage.location?.city || '',
          country: editingPackage.location?.country || ''
        },
        medicalFacility: editingPackage.medicalFacility || {
          name: `${editingPackage.location?.city || 'Unknown'} Medical Center`,
          type: 'medical-center'
        },
        experienceTypes: editingPackage.experienceTypes || ['Treatment-Focused'],
        services: editingPackage.services || [
          {
            name: 'Doctor Consultation',
            description: 'Medical consultation',
            included: true,
            additionalCost: 0
          }
        ],
        isActive: editingPackage.isActive !== undefined ? editingPackage.isActive : true,
        isFeatured: editingPackage.isFeatured !== undefined ? editingPackage.isFeatured : false,
        tags: editingPackage.tags || [editingPackage.category]
      };

      console.log('Formatted package data for update:', packageData);

      const response = await fetch(`http://localhost:5001/api/packages/${editingPackage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });
      
      const result = await response.json();
      console.log('Update package response:', result);
      
      if (response.ok) {
        setEditingPackage(null);
        loadPackages();
        alert('Package updated successfully!');
      } else {
        console.error('Failed to update package:', result);
        alert('Failed to update package: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to update package:', error);
      alert('Failed to update package: ' + error.message);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/packages/${packageId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          loadPackages();
          alert('Package deleted successfully!');
        }
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('Failed to delete package: ' + error.message);
      }
    }
  };

  // Mock data for demo
  const mockDashboardData = {
    stats: {
      totalUsers: 156,
      totalPackages: 4,
      totalBookings: 89,
      activePackages: 4
    },
    recentUsers: [
      { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', createdAt: new Date() },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', createdAt: new Date() },
      { _id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', createdAt: new Date() }
    ],
    recentBookings: [
      { _id: '1', package: { title: 'Wellness & Thermal Spa' }, user: { firstName: 'Alice', lastName: 'Brown' }, status: 'confirmed' },
      { _id: '2', package: { title: 'Dental Care Package' }, user: { firstName: 'Bob', lastName: 'Wilson' }, status: 'pending' },
      { _id: '3', package: { title: 'Hair Transplant' }, user: { firstName: 'Carol', lastName: 'Davis' }, status: 'completed' }
    ]
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Ana uygulamaya geri dön
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { backgroundColor: '#fef3c7', color: '#92400e' },
      confirmed: { backgroundColor: '#d1fae5', color: '#065f46' },
      cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
      completed: { backgroundColor: '#dbeafe', color: '#1e40af' }
    };
    return colors[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
  };

  const renderLoginForm = () => (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Heart style={{ width: '48px', height: '48px', color: '#2563eb', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#6b7280' }}>HealthJourney Platform</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              required
            />
          </div>

          {loginError && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: admin@healthjourney.com<br />
          Password: admin123
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div style={{
      width: '256px',
      backgroundColor: '#1f2937',
      color: 'white',
      minHeight: '100vh'
    }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <Heart style={{ width: '32px', height: '32px', color: '#3b82f6', marginRight: '12px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Admin Panel</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'packages', label: 'Packages', icon: Package },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentView === id ? '#3b82f6' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentView !== id) e.target.style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                if (currentView !== id) e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Icon style={{ width: '20px', height: '20px' }} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #374151' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <LogOut style={{ width: '20px', height: '20px' }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Welcome back, {user?.firstName} {user?.lastName}! ({user?.email})
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Total Users', value: dashboardStats.totalUsers, icon: Users, color: '#3b82f6' },
          { label: 'Total Packages', value: dashboardStats.totalPackages, icon: Package, color: '#10b981' },
          { label: 'Total Bookings', value: dashboardStats.totalBookings, icon: Calendar, color: '#8b5cf6' },
          { label: 'Active Packages', value: dashboardStats.activePackages, icon: TrendingUp, color: '#f59e0b' }
        ].map(({ label, value, icon: Icon, color }, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>{label}</p>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{value}</p>
              </div>
              <Icon style={{ width: '48px', height: '48px', color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Recent Users
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentUsers.length > 0 ? recentUsers.map((user) => (
              <div key={user._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {user.email}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                No recent users
              </div>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Recent Bookings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <div key={booking._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
                    {booking.package?.title || 'Package not found'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {booking.personalInfo?.firstName} {booking.personalInfo?.lastName}
                  </p>
                </div>
                <span style={{
                  ...getStatusColor(booking.status),
                  padding: '4px 8px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {booking.status}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                No recent bookings
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackagesManagement = () => {
    console.log('Rendering packages management, packages state:', packages);
    return (
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Packages Management ({packages.length} packages)
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Add New Package
          </button>
        </div>

        {/* Edit Package Modal */}
        {editingPackage && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '95%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                Edit Package
              </h2>
              
              {/* Tab Navigation */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #e5e7eb', 
                marginBottom: '24px',
                gap: '8px'
              }}>
                {[
                  { id: 'basic', label: 'Basic Info', icon: '📝' },
                  { id: 'services', label: 'Services', icon: '🛠️' },
                  { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
                  { id: 'pricing', label: 'Pricing', icon: '💰' },
                  { id: 'schedule', label: 'Schedule', icon: '📅' },
                  { id: 'media', label: 'Media & SEO', icon: '🎨' }
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    style={{
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: activeTab === id ? '2px solid #3b82f6' : '2px solid transparent',
                      backgroundColor: 'transparent',
                      color: activeTab === id ? '#3b82f6' : '#6b7280',
                      fontWeight: activeTab === id ? '600' : '400',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleEditPackage}>
                {/* Tab Content */}
                <div style={{ minHeight: '400px' }}>
                  {activeTab === 'basic' && (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                          Package Title
                        </label>
                        <input
                          type="text"
                          value={editingPackage.title}
                          onChange={(e) => setEditingPackage(prev => ({ ...prev, title: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                          Description
                        </label>
                        <textarea
                          value={editingPackage.description}
                          onChange={(e) => setEditingPackage(prev => ({ ...prev, description: e.target.value }))}
                          rows="4"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                            City
                          </label>
                          <input
                            type="text"
                            value={editingPackage.location?.city || ''}
                            onChange={(e) => setEditingPackage(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, city: e.target.value }
                            }))}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px'
                            }}
                            required
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                            Country
                          </label>
                          <input
                            type="text"
                            value={editingPackage.location?.country || ''}
                            onChange={(e) => setEditingPackage(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, country: e.target.value }
                            }))}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px'
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                          Category
                        </label>
                        <select
                          value={editingPackage.category || ''}
                          onChange={(e) => setEditingPackage(prev => ({ ...prev, category: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                          }}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="wellness-spa">Wellness & Spa</option>
                          <option value="dental-care">Dental Care</option>
                          <option value="aesthetic-surgery">Aesthetic Surgery</option>
                          <option value="medical-treatment">Medical Treatment</option>
                          <option value="health-checkup">Health Checkup</option>
                          <option value="hair-transplant">Hair Transplant</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                            Duration
                          </label>
                          <input
                            type="text"
                            value={editingPackage.durationString || ''}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, durationString: e.target.value }))}
                            placeholder="e.g., 5 days"
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px'
                            }}
                            required
                          />
                        </div>

                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', fontWeight: '600', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="checkbox"
                              checked={editingPackage.isFeatured || false}
                              onChange={(e) => setEditingPackage(prev => ({ ...prev, isFeatured: e.target.checked }))}
                              style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                              }}
                            />
                            Featured Package
                          </label>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', fontWeight: '600', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={editingPackage.isActive !== false}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, isActive: e.target.checked }))}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer'
                            }}
                          />
                          Package is Active (visible to customers)
                        </label>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          Inactive packages won't be shown to customers on the frontend
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                          Base Price (€)
                        </label>
                        <input
                          type="number"
                          value={editingPackage.pricing?.basePrice || editingPackage.price || ''}
                          onChange={(e) => setEditingPackage(prev => ({ 
                            ...prev, 
                            pricing: { ...prev.pricing, basePrice: parseInt(e.target.value) }
                          }))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </div>

                      <div>
                        <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Price Includes</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {[
                            { key: 'accommodation', label: 'Accommodation' },
                            { key: 'transfers', label: 'Airport Transfers' },
                            { key: 'flights', label: 'Flight Tickets' },
                            { key: 'meals', label: 'Meals' }
                          ].map(({ key, label }) => (
                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="checkbox"
                                checked={editingPackage.pricing?.includes?.[key] || false}
                                onChange={(e) => setEditingPackage(prev => ({ 
                                  ...prev, 
                                  pricing: { 
                                    ...prev.pricing, 
                                    includes: { 
                                      ...prev.pricing?.includes, 
                                      [key]: e.target.checked 
                                    }
                                  }
                                }))}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                      {/* Medical Services */}
                      <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🏥 Medical Services
                        </h4>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {[
                            { key: 'consultation', label: 'Doctor Consultation', price: 100 },
                            { key: 'surgery', label: 'Surgery/Treatment', price: 0 },
                            { key: 'followup', label: 'Follow-up Visits', price: 50 },
                            { key: 'medication', label: 'Medication', price: 0 },
                            { key: 'tests', label: 'Medical Tests', price: 150 }
                          ].map(({ key, label, price }) => (
                            <div key={key} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              padding: '12px',
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <input
                                  type="checkbox"
                                  checked={editingPackage.services?.some(s => s.key === key) || false}
                                  onChange={(e) => {
                                    const services = editingPackage.services || [];
                                    if (e.target.checked) {
                                      // Add service
                                      const newService = { key, name: label, included: true, additionalCost: price };
                                      setEditingPackage(prev => ({ 
                                        ...prev, 
                                        services: [...services.filter(s => s.key !== key), newService]
                                      }));
                                    } else {
                                      // Remove service
                                      setEditingPackage(prev => ({ 
                                        ...prev, 
                                        services: services.filter(s => s.key !== key)
                                      }));
                                    }
                                  }}
                                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                <span style={{ fontWeight: '500' }}>{label}</span>
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>€</span>
                                <input
                                  type="number"
                                  value={editingPackage.services?.find(s => s.key === key)?.additionalCost || price}
                                  onChange={(e) => {
                                    const services = editingPackage.services || [];
                                    const existingService = services.find(s => s.key === key);
                                    if (existingService) {
                                      setEditingPackage(prev => ({ 
                                        ...prev, 
                                        services: services.map(s => 
                                          s.key === key 
                                            ? { ...s, additionalCost: parseInt(e.target.value) || 0 }
                                            : s
                                        )
                                      }));
                                    }
                                  }}
                                  disabled={!editingPackage.services?.some(s => s.key === key)}
                                  style={{
                                    width: '80px',
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Wellness Services */}
                      <div style={{ 
                        backgroundColor: '#f0fdf4', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🧘 Wellness & Spa Services
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          {[
                            'Spa & Massage',
                            'Thermal Baths',
                            'Fitness Center',
                            'Yoga Classes',
                            'Meditation Sessions',
                            'Physiotherapy'
                          ].map((service) => (
                            <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="checkbox"
                                checked={editingPackage.wellnessServices?.includes(service) || false}
                                onChange={(e) => {
                                  const currentServices = editingPackage.wellnessServices || [];
                                  if (e.target.checked) {
                                    setEditingPackage(prev => ({ 
                                      ...prev, 
                                      wellnessServices: [...currentServices, service]
                                    }));
                                  } else {
                                    setEditingPackage(prev => ({ 
                                      ...prev, 
                                      wellnessServices: currentServices.filter(s => s !== service)
                                    }));
                                  }
                                }}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px' }}>{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Transportation */}
                      <div style={{ 
                        backgroundColor: '#fef3c7', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #fbbf24'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🚗 Transportation Services
                        </h4>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {[
                            { key: 'airportPickup', label: 'Airport Pickup', icon: '✈️' },
                            { key: 'airportDropoff', label: 'Airport Drop-off', icon: '🛫' },
                            { key: 'hospitalTransfer', label: 'Hospital Transfers', icon: '🏥' },
                            { key: 'cityTransport', label: 'City Transportation', icon: '🚌' },
                            { key: 'privateDriver', label: 'Private Driver', icon: '🚗' }
                          ].map(({ key, label, icon }) => (
                            <label key={key} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '8px',
                              backgroundColor: 'white',
                              borderRadius: '6px'
                            }}>
                              <input
                                type="checkbox"
                                checked={editingPackage.transportation?.[key] || false}
                                onChange={(e) => {
                                  setEditingPackage(prev => ({ 
                                    ...prev, 
                                    transportation: {
                                      ...prev.transportation,
                                      [key]: e.target.checked
                                    }
                                  }));
                                }}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '18px' }}>{icon}</span>
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Additional Services */}
                      <div style={{ 
                        backgroundColor: '#ede9fe', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #c4b5fd'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          ⭐ Additional Services
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                          {[
                            { key: 'translation', label: 'Medical Translation', icon: '🗣️' },
                            { key: 'interpreter', label: '24/7 Interpreter', icon: '👥' },
                            { key: 'concierge', label: 'Personal Concierge', icon: '🛎️' },
                            { key: 'insurance', label: 'Travel Insurance', icon: '🛡️' },
                            { key: 'emergency', label: 'Emergency Support', icon: '🚨' },
                            { key: 'aftercare', label: 'Post-Treatment Care', icon: '🏠' }
                          ].map(({ key, label, icon }) => (
                            <label key={key} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '8px',
                              backgroundColor: 'white',
                              borderRadius: '6px'
                            }}>
                              <input
                                type="checkbox"
                                checked={editingPackage.additionalServices?.[key] || false}
                                onChange={(e) => {
                                  setEditingPackage(prev => ({ 
                                    ...prev, 
                                    additionalServices: {
                                      ...prev.additionalServices,
                                      [key]: e.target.checked
                                    }
                                  }));
                                }}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '16px' }}>{icon}</span>
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'accommodation' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                      {/* Hotel Information */}
                      <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🏨 Hotel Information
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Hotel Name
                            </label>
                            <input
                              type="text"
                              value={editingPackage.accommodation?.name || ''}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, name: e.target.value }
                              }))}
                              placeholder="e.g., Grand Health Resort"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Hotel Type
                            </label>
                            <select
                              value={editingPackage.accommodation?.type || 'hotel'}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, type: e.target.value }
                              }))}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            >
                              <option value="hotel">Hotel</option>
                              <option value="resort">Resort</option>
                              <option value="medical-hotel">Medical Hotel</option>
                              <option value="spa-resort">Spa Resort</option>
                              <option value="boutique">Boutique Hotel</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginTop: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Star Rating
                            </label>
                            <select
                              value={editingPackage.accommodation?.starRating || 4}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, starRating: parseInt(e.target.value) }
                              }))}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            >
                              <option value={3}>3 Stars</option>
                              <option value={4}>4 Stars</option>
                              <option value={5}>5 Stars</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Distance to Medical Center
                            </label>
                            <input
                              type="text"
                              value={editingPackage.accommodation?.distanceToMedical || ''}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, distanceToMedical: e.target.value }
                              }))}
                              placeholder="e.g., 5 minutes walk, 2 km"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Room Configuration */}
                      <div style={{ 
                        backgroundColor: '#f0f9ff', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🛏️ Room Configuration
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Room Type
                            </label>
                            <select
                              value={editingPackage.accommodation?.roomType || 'standard'}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, roomType: e.target.value }
                              }))}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            >
                              <option value="standard">Standard Room</option>
                              <option value="deluxe">Deluxe Room</option>
                              <option value="suite">Suite</option>
                              <option value="medical-suite">Medical Suite</option>
                              <option value="family">Family Room</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                              Maximum Occupancy
                            </label>
                            <input
                              type="number"
                              value={editingPackage.accommodation?.maxOccupancy || 2}
                              onChange={(e) => setEditingPackage(prev => ({ 
                                ...prev, 
                                accommodation: { ...prev.accommodation, maxOccupancy: parseInt(e.target.value) }
                              }))}
                              min="1"
                              max="6"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                            Room Features
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                            {[
                              'Air Conditioning',
                              'Private Bathroom',
                              'Balcony/Terrace',
                              'Mini Fridge',
                              'Safe Box',
                              'Medical Bed',
                              'Nurse Call System',
                              'Wheelchair Access'
                            ].map((feature) => (
                              <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={editingPackage.accommodation?.roomFeatures?.includes(feature) || false}
                                  onChange={(e) => {
                                    const currentFeatures = editingPackage.accommodation?.roomFeatures || [];
                                    if (e.target.checked) {
                                      setEditingPackage(prev => ({ 
                                        ...prev, 
                                        accommodation: {
                                          ...prev.accommodation,
                                          roomFeatures: [...currentFeatures, feature]
                                        }
                                      }));
                                    } else {
                                      setEditingPackage(prev => ({ 
                                        ...prev, 
                                        accommodation: {
                                          ...prev.accommodation,
                                          roomFeatures: currentFeatures.filter(f => f !== feature)
                                        }
                                      }));
                                    }
                                  }}
                                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '14px' }}>{feature}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hotel Amenities */}
                      <div style={{ 
                        backgroundColor: '#f0fdf4', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #22c55e'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                          🏊 Hotel Amenities
                        </h4>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#059669' }}>
                              🏥 Medical Facilities
                            </h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                              {[
                                'On-site Medical Center',
                                'Pharmacy',
                                'Emergency Room',
                                'Laboratory',
                                'Radiology Department',
                                '24/7 Medical Staff'
                              ].map((amenity) => (
                                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="checkbox"
                                    checked={editingPackage.accommodation?.medicalAmenities?.includes(amenity) || false}
                                    onChange={(e) => {
                                      const currentAmenities = editingPackage.accommodation?.medicalAmenities || [];
                                      if (e.target.checked) {
                                        setEditingPackage(prev => ({ 
                                          ...prev, 
                                          accommodation: {
                                            ...prev.accommodation,
                                            medicalAmenities: [...currentAmenities, amenity]
                                          }
                                        }));
                                      } else {
                                        setEditingPackage(prev => ({ 
                                          ...prev, 
                                          accommodation: {
                                            ...prev.accommodation,
                                            medicalAmenities: currentAmenities.filter(a => a !== amenity)
                                          }
                                        }));
                                      }
                                    }}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '14px' }}>{amenity}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#059669' }}>
                              🏊 Recreation & Wellness
                            </h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                              {[
                                'Swimming Pool',
                                'Spa & Wellness Center',
                                'Fitness Center',
                                'Sauna',
                                'Turkish Bath',
                                'Massage Services',
                                'Yoga Studio',
                                'Garden/Terrace'
                              ].map((amenity) => (
                                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="checkbox"
                                    checked={editingPackage.accommodation?.recreationAmenities?.includes(amenity) || false}
                                    onChange={(e) => {
                                      const currentAmenities = editingPackage.accommodation?.recreationAmenities || [];
                                      if (e.target.checked) {
                                        setEditingPackage(prev => ({ 
                                          ...prev, 
                                          accommodation: {
                                            ...prev.accommodation,
                                            recreationAmenities: [...currentAmenities, amenity]
                                          }
                                        }));
                                      } else {
                                        setEditingPackage(prev => ({ 
                                          ...prev, 
                                          accommodation: {
                                            ...prev.accommodation,
                                            recreationAmenities: currentAmenities.filter(a => a !== amenity)
                                          }
                                        }));
                                      }
                                    }}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '14px' }}>{amenity}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeTab === 'schedule' || activeTab === 'media') && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minHeight: '300px',
                      color: '#6b7280'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                      </h3>
                      <p style={{ textAlign: 'center' }}>
                        Advanced {activeTab} configuration options<br />
                        will be available in the next update.
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Update Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Package Modal */}
        {showAddForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                Add New Package
              </h2>
              
              <form onSubmit={handleAddPackage}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                      Package Title
                    </label>
                    <input
                      type="text"
                      value={newPackage.title}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, title: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        Price (€)
                      </label>
                      <input
                        type="number"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage(prev => ({ ...prev, price: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newPackage.duration}
                        onChange={(e) => setNewPackage(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 5 days"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        City
                      </label>
                      <input
                        type="text"
                        value={newPackage.location.city}
                        onChange={(e) => setNewPackage(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, city: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                        Country
                      </label>
                      <input
                        type="text"
                        value={newPackage.location.country}
                        onChange={(e) => setNewPackage(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, country: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                      Category
                    </label>
                    <select
                      value={newPackage.category}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, category: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="wellness-spa">Wellness & Spa</option>
                      <option value="dental-care">Dental Care</option>
                      <option value="aesthetic-surgery">Aesthetic Surgery</option>
                      <option value="medical-treatment">Medical Treatment</option>
                      <option value="health-checkup">Health Checkup</option>
                      <option value="hair-transplant">Hair Transplant</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                      Image Emoji
                    </label>
                    <input
                      type="text"
                      value={newPackage.image}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="e.g., 🏔️"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: '600', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={newPackage.isActive !== false}
                        onChange={(e) => setNewPackage(prev => ({ ...prev, isActive: e.target.checked }))}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      Package is Active (visible to customers)
                    </label>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Inactive packages won't be shown to customers on the frontend
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Packages List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {packages.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Package style={{ width: '64px', height: '64px', color: '#6b7280', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                No Packages Found
              </h3>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Start by adding your first health tourism package.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', padding: '24px' }}>
              {packages.map((pkg) => (
                <div key={pkg._id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '32px', marginRight: '12px' }}>
                      {pkg.image || '📦'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                        {pkg.title}
                      </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    {pkg.location?.city || 'Unknown'}, {pkg.location?.country || 'Unknown'}
                  </p>
                    </div>
                  </div>

                  <p style={{ color: '#374151', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                    {(pkg.description || '').substring(0, 100)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                        €{pkg.pricing?.basePrice || pkg.price || '0'}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '14px', marginLeft: '8px' }}>
                        {pkg.durationString || 'N/A'}
                      </span>
                    </div>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {pkg.category || 'uncategorized'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBookingsManagement = () => (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Bookings Management ({bookings.length} bookings)
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {bookings.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Calendar style={{ width: '64px', height: '64px', color: '#6b7280', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              No Bookings Found
            </h3>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Bookings will appear here when customers make reservations.
            </p>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Booking #
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Customer
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Package
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Travel Dates
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Total Price
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {booking.bookingNumber}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          {booking.personalInfo?.firstName} {booking.personalInfo?.lastName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {booking.personalInfo?.email}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {booking.personalInfo?.country}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {booking.package?.title || 'Package not found'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {booking.travelDates?.startDate ? 
                          new Date(booking.travelDates.startDate).toLocaleDateString() : 'N/A'
                        } - {booking.travelDates?.endDate ? 
                          new Date(booking.travelDates.endDate).toLocaleDateString() : 'N/A'
                        }
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                        €{booking.pricing?.totalPrice || 0}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        ...getStatusColor(booking.status),
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderOtherViews = () => (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
        {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Management
      </h1>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        padding: '48px',
        textAlign: 'center'
      }}>
        <Package style={{ width: '64px', height: '64px', color: '#6b7280', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Coming Soon
        </h3>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          This feature is under development and will be available soon.
        </p>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Users Management ({users.length} users)
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {users.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Users style={{ width: '64px', height: '64px', color: '#6b7280', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              No Users Found
            </h3>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Users will appear here when they register on the platform.
            </p>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    User
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Contact
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Location
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Preferences
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {user.email}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {user.country || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        Budget: €{user.preferences?.budget || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {user.preferences?.experiences?.length || 0} experiences
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                        color: user.isActive ? '#065f46' : '#991b1b',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {user.isEmailVerified && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            Verified
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'packages':
        return renderPackagesManagement();
      case 'bookings':
        return renderBookingsManagement();
      case 'users':
        return renderUsersManagement();
      case 'settings':
        return renderOtherViews();
      default:
        return renderDashboard();
    }
  };

  // Kullanıcı giriş yapmamışsa veya admin değilse ana sayfaya yönlendir
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          textAlign: 'center'
        }}>
          <Heart style={{ width: '48px', height: '48px', color: '#2563eb', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Admin Panel Access Required
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Please log in with admin credentials to access this panel.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Admin olmayan kullanıcılar için erişim engeli
  if (user.role !== 'admin') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          textAlign: 'center'
        }}>
          <Shield style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Access Denied
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You don't have admin privileges to access this panel.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {renderSidebar()}
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
