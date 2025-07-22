import React, { useState } from 'react';
import { Heart, MapPin, Calendar, DollarSign, User, MessageCircle, Star, Plane, Clock, Globe, Shield, Phone } from 'lucide-react';

const HealthTourismPlatform = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userPreferences, setUserPreferences] = useState({
    budget: 1000,
    dateRange: '',
    experiences: [],
    services: []
  });
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', text: 'Hello! I\'m your AI health tourism advisor. I\'m here to help you find the perfect health experience. What brings you here today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    country: '',
    phone: ''
  });

  const popularTrips = [
    {
      title: 'Wellness & Thermal Spa',
      location: 'Pamukkale, Turkey',
      duration: '5 days',
      price: '€850',
      image: '🏔️',
      rating: 4.8
    },
    {
      title: 'Dental Care Package',
      location: 'Istanbul, Turkey',
      duration: '3 days',
      price: '€650',
      image: '🏛️',
      rating: 4.9
    },
    {
      title: 'Hair Transplant + Recovery',
      location: 'Antalya, Turkey',
      duration: '7 days',
      price: '€1200',
      image: '🏖️',
      rating: 4.7
    },
    {
      title: 'Health Check-up Retreat',
      location: 'Bodrum, Turkey',
      duration: '4 days',
      price: '€920',
      image: '🌊',
      rating: 4.6
    }
  ];

  const experiences = [
    'Relaxing (Wellness)',
    'Treatment-Focused',
    'Close to Nature',
    'Family-Friendly',
    'Quick Care'
  ];

  const services = [
    'Doctor Consultation',
    'Health Screening',
    'Aesthetic Treatments',
    'Psychological Counseling',
    'Thermal Spa',
    'Dietitian Consultation',
    'Sightseeing Tours',
    'Airport Pickup'
  ];

  const handleExperienceChange = (experience) => {
    setUserPreferences(prev => ({
      ...prev,
      experiences: prev.experiences.includes(experience)
        ? prev.experiences.filter(e => e !== experience)
        : [...prev.experiences, experience]
    }));
  };

  const handleServiceChange = (service) => {
    setUserPreferences(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', text: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That sounds great! Let me help you find the perfect health tourism package. Can you tell me more about your budget range?",
        "Based on what you've told me, I recommend exploring our wellness packages in Pamukkale or our dental care options in Istanbul. Would you like me to show you some specific options?",
        "Perfect! I can create a personalized itinerary for you. What dates are you planning to travel?",
        "Excellent choice! Let me prepare a customized package that includes your preferred services. This will take just a moment..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { type: 'ai', text: randomResponse }]);
    }, 1000);

    setChatInput('');
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">HealthJourney</span>
          </div>
          <div className="space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">Login</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Discover the best health experiences tailored for you — powered by smart AI
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Let our AI guide you to the perfect health tourism package, designed specifically for your needs, budget, and preferences.
        </p>
        
        <div className="flex justify-center space-x-6 mb-16">
          <button
            onClick={() => setCurrentPage('filters')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plane className="inline mr-2" />
            Plan a Trip
          </button>
          <button
            onClick={() => setCurrentPage('chat')}
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <MessageCircle className="inline mr-2" />
            Ask AI
          </button>
        </div>

        {/* Popular Trips */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Health Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTrips.map((trip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{trip.image}</div>
                  <h3 className="font-bold text-lg mb-2">{trip.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{trip.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{trip.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFiltersPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">HealthJourney</span>
          </button>
          <div className="text-gray-600">Step 1 of 3</div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Tell us your preferences</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Budget */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                <DollarSign className="inline mr-2" />
                Budget Range
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">€500</span>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  value={userPreferences.budget}
                  onChange={(e) => setUserPreferences(prev => ({...prev, budget: parseInt(e.target.value)}))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-600">€3000+</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-blue-600">€{userPreferences.budget}</span>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                <Calendar className="inline mr-2" />
                Preferred Travel Period
              </label>
              <select
                value={userPreferences.dateRange}
                onChange={(e) => setUserPreferences(prev => ({...prev, dateRange: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a time period</option>
                <option value="next-month">Next Month</option>
                <option value="next-3-months">Next 3 Months</option>
                <option value="next-6-months">Next 6 Months</option>
                <option value="flexible">I'm Flexible</option>
              </select>
            </div>

            {/* Experience Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Experience Type (Select all that apply)
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {experiences.map((experience) => (
                  <label key={experience} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.experiences.includes(experience)}
                      onChange={() => handleExperienceChange(experience)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{experience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Desired Services (Select all that apply)
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <label key={service} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={() => setCurrentPage('suggestion')}
                className="bg-blue-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get My AI Recommendation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuggestionPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">HealthJourney</span>
          </button>
          <div className="text-gray-600">Step 2 of 3</div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Perfect Match Found! 🎯</h1>
            <p className="text-lg text-gray-600">Based on your preferences, our AI recommends this personalized package</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Package Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
              <h2 className="text-3xl font-bold mb-2">Wellness & Thermal Spa Retreat</h2>
              <p className="text-blue-100 text-lg">A perfect blend of relaxation and health care</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Pamukkale, Turkey</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>5 Days, 4 Nights</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 fill-current" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> 4-star thermal hotel accommodation</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Daily thermal spa access</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Full health screening</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> 2 doctor consultations</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Dietitian consultation</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Airport transfers</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> Pamukkale sightseeing tour</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500" /> 24/7 medical support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Itinerary</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="border-l-2 border-blue-300 pl-4">
                      <strong>Day 1:</strong> Arrival, hotel check-in, welcome consultation
                    </div>
                    <div className="border-l-2 border-blue-300 pl-4">
                      <strong>Day 2:</strong> Health screening, thermal spa, relaxation
                    </div>
                    <div className="border-l-2 border-blue-300 pl-4">
                      <strong>Day 3:</strong> Pamukkale tour, thermal baths, dietitian meeting
                    </div>
                    <div className="border-l-2 border-blue-300 pl-4">
                      <strong>Day 4:</strong> Follow-up consultation, spa treatments, free time
                    </div>
                    <div className="border-l-2 border-blue-300 pl-4">
                      <strong>Day 5:</strong> Final health report, departure
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">€{userPreferences.budget}</div>
                    <div className="text-gray-500 text-sm">*Flights not included</div>
                    <div className="text-green-600 text-sm">✓ Available for your selected dates</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setCurrentPage('chat')}
                      className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Chat with AI
                    </button>
                    <button
                      onClick={() => setCurrentPage('reservation')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">HealthJourney</span>
          </button>
          <div className="text-gray-600">AI Assistant</div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold">AI Health Tourism Advisor</h2>
              <p className="text-blue-100">Let me help you find the perfect health experience</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleChatSubmit}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentPage('filters')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Plane className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">Plan a Trip</div>
            </button>
            <button
              onClick={() => setCurrentPage('suggestion')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Heart className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">See Recommendations</div>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Phone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">Get Support</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReservationPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">HealthJourney</span>
          </button>
          <div className="text-gray-600">Step 3 of 3</div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Complete Your Reservation</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({...prev, name: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({...prev, email: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({...prev, phone: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country of Residence</label>
                    <select
                      value={userInfo.country}
                      onChange={(e) => setUserInfo(prev => ({...prev, country: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Health Information (Optional)</label>
                  <textarea
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any medical conditions, allergies, or special requirements we should know about..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded mt-1" />
                    <span className="text-sm text-gray-600">
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded mt-1" />
                    <span className="text-sm text-gray-600">
                      I consent to processing of my personal data for health tourism services (GDPR/KVKK compliant)
                    </span>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded mt-1" />
                    <span className="text-sm text-gray-600">
                      I would like to receive updates about my booking and promotional offers
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold">Wellness & Thermal Spa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>Pamukkale, Turkey</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>5 Days, 4 Nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers:</span>
                    <span>1 Adult</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">€{userPreferences.budget}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">*Flights not included</p>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-6">
                  Complete Reservation
                </button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-700 text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Secure booking with 24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">HealthJourney</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact & Support</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>General Inquiry</option>
                    <option>Booking Support</option>
                    <option>Medical Questions</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Send Message
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">24/7 Support Hotline</div>
                      <div className="text-gray-600">+90 (212) 555-0123</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">support@healthjourney.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Office</div>
                      <div className="text-gray-600">Istanbul, Turkey</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <details className="border border-gray-200 rounded p-3">
                    <summary className="font-semibold cursor-pointer">How do I book a health tourism package?</summary>
                    <p className="mt-2 text-gray-600 text-sm">Simply use our AI assistant or filter system to find packages that match your needs, then complete the reservation process.</p>
                  </details>
                  <details className="border border-gray-200 rounded p-3">
                    <summary className="font-semibold cursor-pointer">What's included in the packages?</summary>
                    <p className="mt-2 text-gray-600 text-sm">Our packages typically include accommodation, medical consultations, treatments, transfers, and support services.</p>
                  </details>
                  <details className="border border-gray-200 rounded p-3">
                    <summary className="font-semibold cursor-pointer">Is my personal information secure?</summary>
                    <p className="mt-2 text-gray-600 text-sm">Yes, we're fully GDPR and KVKK compliant and use industry-standard security measures to protect your data.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation based on current page
  const renderPage = () => {
    switch(currentPage) {
      case 'home': return renderHomePage();
      case 'filters': return renderFiltersPage();
      case 'suggestion': return renderSuggestionPage();
      case 'chat': return renderChatPage();
      case 'reservation': return renderReservationPage();
      case 'contact': return renderContactPage();
      default: return renderHomePage();
    }
  };

  return (
    <div className="font-sans">
      {renderPage()}
      
      {/* Footer (shown on all pages except home) */}
      {currentPage !== 'home' && (
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold">HealthJourney</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered health tourism platform connecting you with the best medical experiences worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Services</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Wellness Tourism</li>
                  <li>Medical Treatments</li>
                  <li>Health Screenings</li>
                  <li>Spa & Relaxation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><button onClick={() => setCurrentPage('contact')}>Contact Us</button></li>
                  <li>FAQ</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>support@healthjourney.com</li>
                  <li>+90 (212) 555-0123</li>
                  <li>24/7 Customer Support</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
              <p>&copy; 2025 HealthJourney. All rights reserved. GDPR & KVKK Compliant.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default HealthTourismPlatform;