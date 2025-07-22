import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Star, Plane, Clock, ArrowLeft, Calendar, Users, Shield, CheckCircle, User, LogOut } from 'lucide-react';
import { packageAPI, bookingAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import ReviewsList from './ReviewsList';
import SearchFilters from './SearchFilters';

const HealthTourismPlatformSimple = () => {
  const { user, login, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'detail', 'login', 'register'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [showPlanTripModal, setShowPlanTripModal] = useState(false);
  const [tripPlanForm, setTripPlanForm] = useState({
    budget: '',
    startDate: '',
    endDate: '',
    medicalNeeds: '',
    location: '',
    duration: '',
    groupSize: '1'
  });
  const [tripPlanResults, setTripPlanResults] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    guests: '1',
    specialRequests: '',
    contactEmail: '',
    contactPhone: '',
    firstName: '',
    lastName: '',
    country: '',
    dateOfBirth: ''
  });
  const [questionForm, setQuestionForm] = useState({
    email: '',
    question: ''
  });
  
  // Search filters state - updated to match SearchFilters component
  const [searchFilters, setSearchFilters] = useState({
    searchText: '',
    priceMin: '',
    priceMax: '',
    location: '',
    category: '',
    experienceTypes: [],
    startDate: '',
    endDate: '',
    duration: '',
    services: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [sortBy, setSortBy] = useState('rating'); // Sort state

  // Handle filter changes from SearchFilters component
  // This function now only receives applied filters (after user clicks Apply button)
  const handleFiltersChange = React.useCallback(async (appliedFilters) => {
    setSearchFilters(appliedFilters);
    
    // Check if filters are empty
    const hasActiveFilters = Object.values(appliedFilters).some(filter => 
      Array.isArray(filter) ? filter.length > 0 : filter !== ''
    );

    if (!hasActiveFilters) {
      // Reset filtered packages when no filters
      setFilteredPackages([]);
      return;
    }
    
    // Use server-side filtering for better performance
    try {
      setLoading(true);
      
      // Prepare filters for API
      const apiFilters = {
        searchText: appliedFilters.searchText || undefined,
        category: appliedFilters.category || undefined,
        location: appliedFilters.location || undefined,
        priceMin: appliedFilters.priceMin || undefined,
        priceMax: appliedFilters.priceMax || undefined,
        startDate: appliedFilters.startDate || undefined,
        endDate: appliedFilters.endDate || undefined,
        duration: appliedFilters.duration || undefined,
        page: 1,
        limit: 20,
        sort: '-rating.average'
      };

      // Add array filters
      if (appliedFilters.experienceTypes && appliedFilters.experienceTypes.length > 0) {
        apiFilters.experienceTypes = appliedFilters.experienceTypes;
      }
      if (appliedFilters.services && appliedFilters.services.length > 0) {
        apiFilters.services = appliedFilters.services;
      }

      // Remove undefined values
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] === undefined) {
          delete apiFilters[key];
        }
      });
      
      const response = await packageAPI.getPackages(apiFilters);
      
      if (response.success && response.data) {
        setFilteredPackages(response.data);
      } else {
        setFilteredPackages([]);
      }
    } catch (error) {
      console.error('Filter error:', error);
      setFilteredPackages([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't depend on any state/props

  // Admin kullanıcısı giriş yaptığında otomatik yönlendirme
  useEffect(() => {
    console.log('User changed:', user);
    if (user && user.role === 'admin') {
      console.log('Admin user detected, navigating to /admin');
      navigate('/admin');
    }
  }, [user, navigate]);

  // Static package IDs from seeder
  const staticPackageIds = {
    'Wellness & Thermal Spa Retreat': '68623d5c113bd1cc7b343307',
    'Dental Care Excellence Package': '68623d5c113bd1cc7b343308', 
    'Hair Transplant & Recovery Package': '68623d5c113bd1cc7b343309',
    'Comprehensive Health Check-up Retreat': '68623d5c113bd1cc7b34330a'
  };

  // Fallback static data with IDs and consistent structure
  const popularTrips = [
    {
      _id: staticPackageIds['Wellness & Thermal Spa Retreat'],
      title: 'Wellness & Thermal Spa Retreat',
      location: { city: 'Pamukkale', country: 'Turkey' },
      duration: { days: 5, nights: 4 },
      pricing: { basePrice: 850, currency: 'EUR' },
      image: '🏔️',
      rating: { average: 4.8, count: 0 },
      category: 'wellness-spa',
      isStatic: true
    },
    {
      _id: staticPackageIds['Dental Care Excellence Package'],
      title: 'Dental Care Excellence Package',
      location: { city: 'Istanbul', country: 'Turkey' },
      duration: { days: 3, nights: 2 },
      pricing: { basePrice: 650, currency: 'EUR' },
      image: '🏛️',
      rating: { average: 4.9, count: 0 },
      category: 'dental-care',
      isStatic: true
    },
    {
      _id: staticPackageIds['Hair Transplant & Recovery Package'],
      title: 'Hair Transplant & Recovery Package',
      location: { city: 'Antalya', country: 'Turkey' },
      duration: { days: 7, nights: 6 },
      pricing: { basePrice: 1200, currency: 'EUR' },
      image: '🏖️',
      rating: { average: 4.7, count: 0 },
      category: 'hair-transplant',
      isStatic: true
    },
    {
      _id: staticPackageIds['Comprehensive Health Check-up Retreat'],
      title: 'Comprehensive Health Check-up Retreat',
      location: { city: 'Bodrum', country: 'Turkey' },
      duration: { days: 4, nights: 3 },
      pricing: { basePrice: 920, currency: 'EUR' },
      image: '🌊',
      rating: { average: 4.6, count: 0 },
      category: 'health-checkup',
      isStatic: true
    }
  ];

  // Load packages from API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const response = await packageAPI.getAllPackages();
        console.log('🔍 Packages API response:', response);
        console.log('📊 Response count:', response?.count);
        console.log('📊 Response total:', response?.total);
        console.log('📦 Response data length:', response?.data?.length);
        
        if (response.success && response.data) {
          console.log('✅ All packages from API:', response.data);
          console.log('📋 Setting packages state with', response.data.length, 'packages');
          setPackages([...response.data]); // Force new array reference
        } else {
          console.log('❌ API response not successful, setting empty packages');
          setPackages([]);
        }
      } catch (error) {
        console.error('💥 Failed to load packages:', error);
        console.log('❌ API error, setting empty packages');
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);


  // Helper function to get emoji for package category
  const getPackageEmoji = (category) => {
    const emojiMap = {
      'wellness-spa': '🏔️',
      'dental-care': '🏛️',
      'hair-transplant': '🏖️',
      'health-checkup': '🌊',
      'aesthetic-surgery': '✨',
      'eye-surgery': '👁️',
      'orthopedic': '🦴',
      'cardiology': '❤️'
    };
    return emojiMap[category] || '🏥';
  };

  // Smart package display logic with sorting
  const displayPackages = React.useMemo(() => {
    const hasActiveFilters = Object.values(searchFilters).some(filter => 
      Array.isArray(filter) ? filter.length > 0 : filter !== ''
    );

    let packagesToDisplay = [];
    if (!hasActiveFilters) {
      // No filters applied - show all packages
      packagesToDisplay = [...packages];
    } else {
      // Filters applied - only show filtered results (even if empty)
      packagesToDisplay = [...filteredPackages];
    }

    // Apply sorting
    return packagesToDisplay.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricing.basePrice - b.pricing.basePrice;
        case 'price-high':
          return b.pricing.basePrice - a.pricing.basePrice;
        case 'rating':
          return b.rating.average - a.rating.average;
        case 'duration':
          return a.duration.days - b.duration.days;
        case 'newest':
          return new Date(b.createdAt || '2024-01-01') - new Date(a.createdAt || '2024-01-01');
        default:
          return b.rating.average - a.rating.average;
      }
    });
  }, [packages, filteredPackages, searchFilters, sortBy]);

  // Handle package click
  const handlePackageClick = (packageData) => {
    setSelectedPackage(packageData);
    setCurrentView('detail');
  };

  // Handle back to home
  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPackage(null);
  };

  // Auth handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const credentials = {
        email: loginForm.email,
        password: loginForm.password
      };
      const response = await login(credentials);
      console.log('Login response:', response);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      
      // Login sonrası direkt kontrol
      if (response && response.data && response.data.user && response.data.user.role === 'admin') {
        console.log('Admin detected in login response, navigating...');
        navigate('/admin');
      }
      
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setAuthLoading(true);
    try {
      // Register logic would go here - for now just show success
      alert('Registration successful! Please login.');
      setShowRegisterModal(false);
      setShowLoginModal(true);
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Render header with auth state
  const renderHeader = () => (
    <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart style={{ width: '32px', height: '32px', color: '#2563eb' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>HealthJourney</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
                <User style={{ width: '20px', height: '20px' }} />
                <span>Welcome, {user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#6b7280', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Login
              </button>
              <button 
                onClick={() => setShowRegisterModal(true)}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // Render package detail page
  const renderPackageDetail = () => {
    const pkg = selectedPackage;
    if (!pkg) return null;

    // Debug package data
    console.log('🔍 Selected Package Full Data:', pkg);
    console.log('📦 Package includes:', pkg.includes);
    console.log('🎯 Package experienceTypes:', pkg.experienceTypes);
    console.log('🛠️ Package services:', pkg.services);

    // Smart fallback for includes based on category
    const getSmartIncludes = (category, originalIncludes) => {
      if (originalIncludes && Array.isArray(originalIncludes) && originalIncludes.length > 0) {
        return originalIncludes;
      }
      
      const categoryIncludes = {
        'dental-care': [
          'Dental consultation & examination',
          'Dental procedures & treatments',
          'Premium hotel accommodation',
          'Airport transfers (VIP)',
          'Local medical coordinator',
          'Follow-up care instructions',
          'Translator services'
        ],
        'hair-transplant': [
          'Hair transplant consultation',
          'FUE/DHI hair transplant procedure',
          'Luxury hotel accommodation',
          'Airport transfers',
          'Medical coordinator support',
          'Post-operation care kit',
          'Hair care products'
        ],
        'wellness-spa': [
          'Thermal spa treatments',
          'Wellness consultation',
          'Spa hotel accommodation',
          'Daily healthy meals',
          'Airport transfers',
          'Massage therapies',
          'Relaxation activities'
        ],
        'health-checkup': [
          'Comprehensive health screening',
          'Blood tests & lab work',
          'Medical consultations',
          'Hotel accommodation',
          'Airport transfers',
          'Health reports in English',
          'Medical coordinator'
        ],
        'aesthetic-surgery': [
          'Aesthetic consultation',
          'Surgical procedures',
          'Recovery accommodation',
          'Airport transfers',
          'Medical care team',
          'Post-op care kit',
          'Follow-up appointments'
        ]
      };
      
      return categoryIncludes[category] || [
        'Medical consultation',
        'Accommodation',
        'Airport transfers',
        'Local support',
        'Health screening'
      ];
    };

    // Data structure is now consistent
    const packageInfo = {
      title: pkg.title,
      location: `${pkg.location.city}, ${pkg.location.country}`,
      duration: `${pkg.duration.days} days, ${pkg.duration.nights} nights`,
      price: `€${pkg.pricing.basePrice}`,
      image: pkg.image || getPackageEmoji(pkg.category),
      rating: pkg.rating.average,
      description: pkg.description || 'A comprehensive health tourism package designed for your wellness and recovery.',
      includes: getSmartIncludes(pkg.category, pkg.includes),
      category: pkg.category || 'health-tourism',
      experienceTypes: pkg.experienceTypes || [],
      services: pkg.services || []
    };

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleBackToHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                <ArrowLeft style={{ width: '20px', height: '20px' }} />
                Back to Home
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>HealthJourney</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
                    <User style={{ width: '20px', height: '20px' }} />
                    <span>Welcome, {user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#6b7280', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    style={{ 
                      backgroundColor: '#2563eb', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Package Detail Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          {/* Hero Section */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            overflow: 'hidden',
            marginBottom: '32px'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)', 
              color: 'white', 
              padding: '48px 32px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>
                {packageInfo.image}
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
                {packageInfo.title}
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '18px' }}>{packageInfo.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '18px' }}>{packageInfo.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star style={{ width: '20px', height: '20px', fill: 'currentColor' }} />
                  <span style={{ fontSize: '18px' }}>{packageInfo.rating}/5</span>
                </div>
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                {packageInfo.price}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Left Column - Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Description */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  Package Description
                </h2>
                <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '16px' }}>
                  {packageInfo.description}
                </p>
              </div>

              {/* What's Included */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  What's Included
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {packageInfo.includes.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                      <span style={{ color: '#374151', fontSize: '16px' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Types */}
              {packageInfo.experienceTypes && packageInfo.experienceTypes.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                    Experience Types
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {packageInfo.experienceTypes.map((type, index) => {
                      // Safe handling for both string and object types
                      let typeName = '';
                      if (typeof type === 'string') {
                        typeName = type;
                      } else if (type && typeof type === 'object') {
                        // Handle object case - try common property names
                        typeName = type.name || type.title || type.type || String(type);
                      } else {
                        typeName = String(type || '');
                      }
                      
                      // Format the type name
                      const formattedName = typeName
                        ? typeName.charAt(0).toUpperCase() + typeName.slice(1).replace('-', ' ')
                        : 'Experience';

                      return (
                        <span 
                          key={index} 
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {formattedName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Included Services */}
              {packageInfo.services && packageInfo.services.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                    Included Services
                  </h2>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {packageInfo.services.map((service, index) => {
                      // Safe handling for both string and object types
                      let serviceName = '';
                      if (typeof service === 'string') {
                        serviceName = service;
                      } else if (service && typeof service === 'object') {
                        // Handle object case - try common property names
                        serviceName = service.name || service.title || service.service || String(service);
                      } else {
                        serviceName = String(service || '');
                      }
                      
                      // Format the service name
                      const formattedName = serviceName
                        ? serviceName.charAt(0).toUpperCase() + serviceName.slice(1).replace('-', ' ')
                        : 'Service';

                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Shield style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                          <span style={{ color: '#374151', fontSize: '16px' }}>
                            {formattedName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sample Itinerary */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  Sample Itinerary
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '16px' }}>
                    <strong style={{ color: '#1f2937' }}>Day 1:</strong>
                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>Arrival, hotel check-in, initial consultation</span>
                  </div>
                  <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '16px' }}>
                    <strong style={{ color: '#1f2937' }}>Day 2:</strong>
                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>Medical procedures and treatments</span>
                  </div>
                  <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '16px' }}>
                    <strong style={{ color: '#1f2937' }}>Day 3:</strong>
                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>Recovery and follow-up care</span>
                  </div>
                  <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '16px' }}>
                    <strong style={{ color: '#1f2937' }}>Final Day:</strong>
                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>Final check-up and departure</span>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Star style={{ width: '24px', height: '24px', color: '#fbbf24', fill: '#fbbf24' }} />
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Customer Reviews
                  </h2>
                </div>
                <ReviewsList packageId={pkg._id} />
              </div>
            </div>

            {/* Right Column - Booking */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Booking Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: '24px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  Book This Package
                </h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Total Price:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                      {packageInfo.price}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>*Flights not included</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Calendar style={{ width: '18px', height: '18px' }} />
                    Book Now
                  </button>
                  
                  <button
                    onClick={() => setShowQuestionsModal(true)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#2563eb',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '2px solid #2563eb',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageCircle style={{ width: '18px', height: '18px' }} />
                    Ask Questions
                  </button>
                </div>

                <div style={{ 
                  backgroundColor: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '8px', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                  <span style={{ fontSize: '14px', color: '#166534' }}>
                    Secure booking with 24/7 support
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  Quick Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Duration:</span>
                    <span style={{ color: '#1f2937', fontWeight: '500' }}>{packageInfo.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Location:</span>
                    <span style={{ color: '#1f2937', fontWeight: '500' }}>{packageInfo.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Rating:</span>
                    <span style={{ color: '#1f2937', fontWeight: '500' }}>{packageInfo.rating}/5 ⭐</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Category:</span>
                    <span style={{ color: '#1f2937', fontWeight: '500' }}>{packageInfo.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal for Detail Page */}
        {showBookingModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
                📅 Book Your Package
              </h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
                {selectedPackage ? (selectedPackage.isApiData ? selectedPackage.title : selectedPackage.title) : 'Package'}
              </p>
              
            <form onSubmit={async (e) => {
              e.preventDefault();
              setAuthLoading(true);
              
              try {
                // Calculate pricing data - handle both API and static packages
                const basePrice = selectedPackage.pricing?.basePrice || 
                  parseInt(selectedPackage.price?.replace('€', '').replace(',', '') || '0');
                
                // Prepare booking data matching backend model
              const bookingData = {
                package: selectedPackage._id,
                personalInfo: {
                  firstName: bookingForm.firstName,
                  lastName: bookingForm.lastName,
                  email: bookingForm.contactEmail,
                  phone: bookingForm.contactPhone,
                  country: bookingForm.country,
                  dateOfBirth: bookingForm.dateOfBirth
                },
                  travelDates: {
                    startDate: bookingForm.startDate,
                    endDate: bookingForm.endDate,
                    flexibility: 'exact'
                  },
                  travelers: {
                    adults: parseInt(bookingForm.guests) || 1,
                    children: 0,
                    infants: 0
                  },
                  pricing: {
                    basePrice: basePrice,
                    additionalServices: 0,
                    discounts: 0,
                    taxes: 0,
                    totalPrice: basePrice,
                    currency: 'EUR'
                  },
                  healthInfo: {
                    specialRequirements: bookingForm.specialRequests || ''
                  },
                  status: 'pending-confirmation'
                };

                // Only add user if logged in
                if (user && user.id) {
                  bookingData.user = user.id;
                }

                console.log('Sending booking data:', bookingData);

                // Send booking request to API
                const response = await bookingAPI.createBooking(bookingData);
                
                if (response.success) {
                  alert('Booking request submitted successfully! We will contact you soon with confirmation details.');
                } else {
                  alert('Booking request submitted! We will contact you soon.');
                }
                
                setShowBookingModal(false);
                setBookingForm({
                  startDate: '',
                  endDate: '',
                  guests: '1',
                  specialRequests: '',
                  contactEmail: '',
                  contactPhone: '',
                  firstName: '',
                  lastName: '',
                  country: '',
                  dateOfBirth: ''
                });
              } catch (error) {
                console.error('Booking submission error:', error);
                alert('There was an error submitting your booking. Please try again or contact support.');
                setShowBookingModal(false);
                setBookingForm({
                  startDate: '',
                  endDate: '',
                  guests: '1',
                  specialRequests: '',
                  contactEmail: '',
                  contactPhone: '',
                  firstName: '',
                  lastName: '',
                  country: '',
                  dateOfBirth: ''
                });
              } finally {
                setAuthLoading(false);
              }
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.endDate}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Number of Guests
                  </label>
                  <select
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guests: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                    required
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5+ Guests</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={bookingForm.firstName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={bookingForm.lastName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingForm.contactEmail}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.contactPhone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+90 555 123 4567"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={bookingForm.country}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Turkey"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={bookingForm.dateOfBirth}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Special Requests or Medical Needs
                  </label>
                  <textarea
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Please let us know about any special requirements, dietary restrictions, medical conditions, or accessibility needs..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ 
                  backgroundColor: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield style={{ width: '16px', height: '16px' }} />
                    Booking Confirmation
                  </h4>
                  <p style={{ fontSize: '14px', color: '#166534', marginBottom: '8px' }}>
                    • We'll contact you within 24 hours to confirm availability
                  </p>
                  <p style={{ fontSize: '14px', color: '#166534', marginBottom: '8px' }}>
                    • No payment required until confirmation
                  </p>
                  <p style={{ fontSize: '14px', color: '#166534' }}>
                    • Free consultation with our medical coordinator
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingForm({
                        startDate: '',
                        endDate: '',
                        guests: '1',
                        specialRequests: '',
                        contactEmail: '',
                        contactPhone: ''
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Calendar style={{ width: '18px', height: '18px' }} />
                    Submit Booking Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions Modal for Detail Page */}
        {showQuestionsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
                ❓ Ask Questions
              </h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
                Have questions about this package? Our medical experts are here to help!
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Your question has been sent! We will respond within 2 hours.');
                setShowQuestionsModal(false);
                setQuestionForm({
                  email: '',
                  question: ''
                });
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={questionForm.email}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Your Question
                  </label>
                  <textarea
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Ask about medical procedures, recovery time, accommodation, costs, or anything else you'd like to know..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minHeight: '120px',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <div style={{ 
                  backgroundColor: '#eff6ff', 
                  border: '1px solid #bfdbfe', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle style={{ width: '16px', height: '16px' }} />
                    Quick Response Guarantee
                  </h4>
                  <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                    • Medical experts available 24/7
                  </p>
                  <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                    • Average response time: 2 hours
                  </p>
                  <p style={{ fontSize: '14px', color: '#1e40af' }}>
                    • Free consultation and advice
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuestionsModal(false);
                      setQuestionForm({
                        email: '',
                        question: ''
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageCircle style={{ width: '18px', height: '18px' }} />
                    Send Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (currentView === 'detail' && selectedPackage) {
    return renderPackageDetail();
  }

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
        {renderHeader()}

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '24px',
          lineHeight: '1.1'
        }}>
          Discover the best health experiences tailored for you — powered by smart AI
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#6b7280', 
          marginBottom: '48px', 
          maxWidth: '768px', 
          margin: '0 auto 48px auto' 
        }}>
          Let our AI guide you to the perfect health tourism package, designed specifically for your needs, budget, and preferences.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '64px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPlanTripModal(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plane style={{ width: '20px', height: '20px' }} />
            Plan a Trip
          </button>
          <button
            onClick={() => alert('Ask AI clicked!')}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageCircle style={{ width: '20px', height: '20px' }} />
            Ask AI
          </button>
        </div>

        {/* Advanced Search & Filters */}
        <SearchFilters 
          onFiltersChange={handleFiltersChange}
          initialFilters={searchFilters}
        />

        {/* Filter Results Summary */}
        {(Object.values(searchFilters).some(filter => 
          Array.isArray(filter) ? filter.length > 0 : filter !== ''
        )) && (
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto 24px auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>
                Found {displayPackages.length} packages
              </span>
              
              {/* Active Filters Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {searchFilters.searchText && (
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #bfdbfe'
                  }}>
                    Search: "{searchFilters.searchText}"
                  </span>
                )}
                
                {searchFilters.category && (
                  <span style={{
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #bbf7d0'
                  }}>
                    Category: {searchFilters.category.replace('-', ' ')}
                  </span>
                )}
                
                {searchFilters.location && (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #fde68a'
                  }}>
                    Location: {searchFilters.location}
                  </span>
                )}
                
                {(searchFilters.priceMin || searchFilters.priceMax) && (
                  <span style={{
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #d8b4fe'
                  }}>
                    Price: €{searchFilters.priceMin || '0'} - €{searchFilters.priceMax || '∞'}
                  </span>
                )}
                
                {searchFilters.experienceTypes && searchFilters.experienceTypes.length > 0 && (
                  <span style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #a7f3d0'
                  }}>
                    Experience: {searchFilters.experienceTypes.length} selected
                  </span>
                )}
              </div>
            </div>
            
            {/* Sort Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        )}

        {/* Popular Trips */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
            Popular Health Experiences
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid #f3f4f6',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading packages...</p>
            </div>
          ) : (
            <>
              {/* No Results Message */}
              {displayPackages.length === 0 && !loading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  marginBottom: '32px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#374151' }}>
                    No packages found for your search
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '16px' }}>
                    {Object.values(searchFilters).some(filter => 
                      Array.isArray(filter) ? filter.length > 0 : filter !== ''
                    ) ? (
                      <>
                        We couldn't find any packages matching your criteria.<br/>
                        Try adjusting your filters for more results.
                      </>
                    ) : (
                      'No packages are currently available. Please try again later.'
                    )}
                  </p>
                  
                  {/* Suggestions */}
                  {Object.values(searchFilters).some(filter => 
                    Array.isArray(filter) ? filter.length > 0 : filter !== ''
                  ) && (
                    <div style={{ 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '12px', 
                      padding: '20px',
                      marginBottom: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                        💡 Try these suggestions:
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        {(searchFilters.priceMin || searchFilters.priceMax) && (
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            • Expand your budget range - most packages are €650-€1200 or €3000+
                          </p>
                        )}
                        {searchFilters.location && (
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            • Try broader locations like "Turkey" or remove location filter
                          </p>
                        )}
                        {searchFilters.category && (
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            • Browse other categories like "dental-care" or "wellness-spa"
                          </p>
                        )}
                        {searchFilters.experienceTypes.length > 0 && (
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            • Remove some experience type filters for more options
                          </p>
                        )}
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>
                          • Clear all filters to see all available packages
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSearchFilters({
                        searchText: '',
                        priceMin: '',
                        priceMax: '',
                        location: '',
                        category: '',
                        experienceTypes: [],
                        startDate: '',
                        endDate: '',
                        duration: '',
                        services: []
                      });
                      setFilteredPackages([]);
                    }}
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {displayPackages.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '24px' 
                }}>
                  {displayPackages.map((trip, index) => {
                  // Data structure is now consistent
                  const packageData = {
                    title: trip.title,
                    location: `${trip.location.city}, ${trip.location.country}`,
                    duration: `${trip.duration.days} days`,
                    price: `€${trip.pricing.basePrice}`,
                    image: trip.image || getPackageEmoji(trip.category),
                    rating: trip.rating.average,
                  };

                  return (
                    <div 
                      key={trip._id || index} 
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onClick={() => handlePackageClick(trip)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{ padding: '24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>
                          {packageData.image}
                        </div>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
                          {packageData.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', marginBottom: '8px' }}>
                          <MapPin style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                          <span style={{ fontSize: '14px' }}>{packageData.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', marginBottom: '8px' }}>
                          <Clock style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                          <span style={{ fontSize: '14px' }}>{packageData.duration}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                            {packageData.price}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: '#fbbf24' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '4px' }}>
                              {packageData.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </>
          )}
        </div>
      </div>
      </div>

      {/* Ana sayfa booking modalı kaldırıldı - booking sadece package detail sayfasından yapılabilir */}

      {/* Questions Modal */}
      {showQuestionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
              ❓ Ask Questions
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
              Have questions about this package? Our medical experts are here to help!
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Your question has been sent! We will respond within 2 hours.');
              setShowQuestionsModal(false);
              setQuestionForm({
                email: '',
                question: ''
              });
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Your Email
                </label>
                <input
                  type="email"
                  value={questionForm.email}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Your Question
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Ask about medical procedures, recovery time, accommodation, costs, or anything else you'd like to know..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ 
                backgroundColor: '#eff6ff', 
                border: '1px solid #bfdbfe', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle style={{ width: '16px', height: '16px' }} />
                  Quick Response Guarantee
                </h4>
                <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                  • Medical experts available 24/7
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                  • Average response time: 2 hours
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  • Free consultation and advice
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionsModal(false);
                    setQuestionForm({
                      email: '',
                      question: ''
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle style={{ width: '18px', height: '18px' }} />
                  Send Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
              Login to HealthJourney
            </h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    opacity: authLoading ? 0.7 : 1
                  }}
                >
                  {authLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280' }}>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
              Create Account
            </h2>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirm Password</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    opacity: authLoading ? 0.7 : 1
                  }}
                >
                  {authLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280' }}>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
                style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Plan Trip Modal */}
      {showPlanTripModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
              🧠 AI Trip Planner
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '32px' }}>
              Let our AI find the perfect health tourism package for you
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle trip planning logic here
              setTripPlanResults(displayPackages.slice(0, 3)); // Show some results for demo
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Budget Range (€)
                  </label>
                  <select
                    value={tripPlanForm.budget}
                    onChange={(e) => setTripPlanForm(prev => ({ ...prev, budget: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                    required
                  >
                    <option value="">Select budget</option>
                    <option value="500-1000">€500 - €1,000</option>
                    <option value="1000-2000">€1,000 - €2,000</option>
                    <option value="2000-3000">€2,000 - €3,000</option>
                    <option value="3000+">€3,000+</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Duration
                  </label>
                  <select
                    value={tripPlanForm.duration}
                    onChange={(e) => setTripPlanForm(prev => ({ ...prev, duration: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="3-5">3-5 days</option>
                    <option value="5-7">5-7 days</option>
                    <option value="7-10">7-10 days</option>
                    <option value="10+">10+ days</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    value={tripPlanForm.startDate}
                    onChange={(e) => setTripPlanForm(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Preferred Location
                  </label>
                  <select
                    value={tripPlanForm.location}
                    onChange={(e) => setTripPlanForm(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Any location</option>
                    <option value="istanbul">Istanbul, Turkey</option>
                    <option value="antalya">Antalya, Turkey</option>
                    <option value="izmir">Izmir, Turkey</option>
                    <option value="bodrum">Bodrum, Turkey</option>
                    <option value="pamukkale">Pamukkale, Turkey</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Medical Needs / Interests
                </label>
                <textarea
                  value={tripPlanForm.medicalNeeds}
                  onChange={(e) => setTripPlanForm(prev => ({ ...prev, medicalNeeds: e.target.value }))}
                  placeholder="Describe your health goals, medical needs, or areas of interest (e.g., dental care, wellness, aesthetic surgery, health check-up...)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Group Size
                </label>
                <select
                  value={tripPlanForm.groupSize}
                  onChange={(e) => setTripPlanForm(prev => ({ ...prev, groupSize: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="1">Just me</option>
                  <option value="2">2 people</option>
                  <option value="3-4">3-4 people</option>
                  <option value="5+">5+ people</option>
                </select>
              </div>

              {tripPlanResults.length > 0 && (
                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 AI Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tripPlanResults.map((pkg, index) => {
                      const isApiData = pkg._id !== undefined;
                      const packageData = isApiData ? {
                        title: pkg.title,
                        location: `${pkg.location.city}, ${pkg.location.country}`,
                        duration: pkg.durationString || `${pkg.duration.days} days`,
                        price: `€${pkg.pricing.basePrice}`,
                        image: getPackageEmoji(pkg.category),
                        rating: pkg.rating.average
                      } : pkg;

                      return (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setShowPlanTripModal(false);
                            handlePackageClick(isApiData ? pkg : packageData, isApiData);
                          }}
                        >
                          <div style={{ fontSize: '32px' }}>
                            {packageData.image}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1f2937' }}>
                              {packageData.title}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              {packageData.location} • {packageData.duration}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                                {packageData.price}
                              </span>
                              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                ⭐ {packageData.rating}
                              </span>
                            </div>
                          </div>
                          <div style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
                            View Details
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanTripModal(false);
                    setTripPlanForm({
                      budget: '',
                      startDate: '',
                      endDate: '',
                      medicalNeeds: '',
                      location: '',
                      duration: '',
                      groupSize: '1'
                    });
                    setTripPlanResults([]);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  🔍 Find My Perfect Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
              📅 Book Your Package
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
              {selectedPackage ? (selectedPackage.isApiData ? selectedPackage.title : selectedPackage.title) : 'Package'}
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Booking request submitted! We will contact you soon.');
              setShowBookingModal(false);
              setBookingForm({
                startDate: '',
                endDate: '',
                guests: '1',
                specialRequests: '',
                contactEmail: '',
                contactPhone: ''
              });
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.startDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.endDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Number of Guests
                </label>
                <select
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, guests: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Guests</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={bookingForm.contactEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.contactPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Special Requests or Medical Needs
                </label>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Please let us know about any special requirements, dietary restrictions, medical conditions, or accessibility needs..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ 
                backgroundColor: '#f0fdf4', 
                border: '1px solid #bbf7d0', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield style={{ width: '16px', height: '16px' }} />
                  Booking Confirmation
                </h4>
                <p style={{ fontSize: '14px', color: '#166534', marginBottom: '8px' }}>
                  • We'll contact you within 24 hours to confirm availability
                </p>
                <p style={{ fontSize: '14px', color: '#166534', marginBottom: '8px' }}>
                  • No payment required until confirmation
                </p>
                <p style={{ fontSize: '14px', color: '#166534' }}>
                  • Free consultation with our medical coordinator
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingForm({
                      startDate: '',
                      endDate: '',
                      guests: '1',
                      specialRequests: '',
                      contactEmail: '',
                      contactPhone: ''
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Calendar style={{ width: '18px', height: '18px' }} />
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#1f2937' }}>
              ❓ Ask Questions
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
              Have questions about this package? Our medical experts are here to help!
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Your question has been sent! We will respond within 2 hours.');
              setShowQuestionsModal(false);
              setQuestionForm({
                email: '',
                question: ''
              });
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Your Email
                </label>
                <input
                  type="email"
                  value={questionForm.email}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Your Question
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Ask about medical procedures, recovery time, accommodation, costs, or anything else you'd like to know..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ 
                backgroundColor: '#eff6ff', 
                border: '1px solid #bfdbfe', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle style={{ width: '16px', height: '16px' }} />
                  Quick Response Guarantee
                </h4>
                <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                  • Medical experts available 24/7
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                  • Average response time: 2 hours
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  • Free consultation and advice
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionsModal(false);
                    setQuestionForm({
                      email: '',
                      question: ''
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle style={{ width: '18px', height: '18px' }} />
                  Send Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthTourismPlatformSimple;
