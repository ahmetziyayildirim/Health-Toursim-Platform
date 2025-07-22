import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Star, Plane, Clock, ArrowLeft, Calendar, Users, Shield, CheckCircle, User, LogOut } from 'lucide-react';
import { packageAPI, bookingAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import ReviewsList from './ReviewsList';

const PackageDetailWithReviews = () => {
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
        if (response.success) {
          setPackages(response.data);
        }
      } catch (error) {
        console.error('Failed to load packages:', error);
        // Keep using static data as fallback
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

  // Use API data if available, otherwise fallback to static data
  const displayPackages = packages.length > 0 ? packages : popularTrips;

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

  // Render package detail page with reviews
  const renderPackageDetail = () => {
    const pkg = selectedPackage;
    if (!pkg) return null;

    // Data structure is now consistent
    const packageInfo = {
      title: pkg.title,
      location: `${pkg.location.city}, ${pkg.location.country}`,
      duration: `${pkg.duration.days} days, ${pkg.duration.nights} nights`,
      price: `€${pkg.pricing.basePrice}`,
      image: pkg.image || getPackageEmoji(pkg.category),
      rating: pkg.rating.average,
      description: pkg.description || 'A comprehensive health tourism package designed for your wellness and recovery.',
      includes: pkg.includes || [
        'Medical consultation',
        'Accommodation',
        'Airport transfers',
        'Local support',
        'Health screening'
      ],
      category: pkg.category || 'health-tourism'
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
                  <StarRating rating={packageInfo.rating} size="lg" showNumber={true} />
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

              {/* Reviews Section - NEW! */}
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
                    <span style={{ color: '#1f2937', fontWeight: '500' }}>
                      <StarRating rating={packageInfo.rating} size="sm" showNumber={true} />
                    </span>
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
      </div>
    );
  };

  // Render home page (package list)
  const renderHomePage = () => (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
      {/* Header */}
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

        {/* Popular Trips */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
            Popular Health Experiences with Reviews
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid #f3f4f6',
                borderTop: '
