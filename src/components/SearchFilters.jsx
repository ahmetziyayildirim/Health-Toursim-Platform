import React, { useState, useEffect } from 'react';
import { Search, Filter, X, MapPin, Calendar, DollarSign, Clock, Tag, Users, CalendarDays } from 'lucide-react';

const SearchFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    priceMin: '',
    priceMax: '',
    location: '',
    locationSearch: '',
    category: '',
    experienceTypes: [],
    duration: '',
    services: [],
    dateAvailability: {
      startDate: '',
      endDate: '',
      flexible: false
    },
    ...initialFilters
  });

  // Categories from backend model
  const categories = [
    { value: 'wellness-spa', label: 'Wellness & Spa' },
    { value: 'medical-treatment', label: 'Medical Treatment' },
    { value: 'dental-care', label: 'Dental Care' },
    { value: 'aesthetic-surgery', label: 'Aesthetic Surgery' },
    { value: 'health-checkup', label: 'Health Check-up' },
    { value: 'rehabilitation', label: 'Rehabilitation' },
    { value: 'fertility-treatment', label: 'Fertility Treatment' },
    { value: 'eye-surgery', label: 'Eye Surgery' },
    { value: 'hair-transplant', label: 'Hair Transplant' },
    { value: 'weight-loss', label: 'Weight Loss' }
  ];

  const experienceTypes = [
    'Relaxing (Wellness)',
    'Treatment-Focused',
    'Close to Nature',
    'Family-Friendly',
    'Quick Care'
  ];

  const popularServices = [
    'Doctor Consultation',
    'Health Screening',
    'Aesthetic Treatments',
    'Thermal Spa',
    'Sightseeing Tours',
    'Airport Pickup',
    'Medical Tests',
    'Surgery',
    'Physiotherapy',
    'Massage Therapy'
  ];

  const locations = [
    'Istanbul, Turkey',
    'Antalya, Turkey',
    'Izmir, Turkey',
    'Bodrum, Turkey',
    'Pamukkale, Turkey',
    'Ankara, Turkey'
  ];

  const priceRanges = [
    { value: '0-500', label: '€0 - €500' },
    { value: '500-1000', label: '€500 - €1,000' },
    { value: '1000-2000', label: '€1,000 - €2,000' },
    { value: '2000-3000', label: '€2,000 - €3,000' },
    { value: '3000-5000', label: '€3,000 - €5,000' },
    { value: '5000+', label: '€5,000+' }
  ];

  const durationOptions = [
    { value: '1-3', label: '1-3 days' },
    { value: '4-7', label: '4-7 days' },
    { value: '8-14', label: '8-14 days' },
    { value: '15+', label: '15+ days' }
  ];

  // Separate states for slider values to prevent too many API calls
  const [sliderValues, setSliderValues] = useState({
    priceMin: filters.priceMin || 500,
    priceMax: filters.priceMax || 3000
  });

  // Define slider boundaries
  const SLIDER_MIN = 500;
  const SLIDER_MAX = 5000; // Increased to handle 3K+ properly

  // Store applied filters separately to prevent constant API calls
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);

  // Only update parent when applied filters change (much less frequent)
  useEffect(() => {
    onFiltersChange(appliedFilters);
  }, [appliedFilters, onFiltersChange]);

  // Track if there are unapplied changes
  useEffect(() => {
    const hasChanges = JSON.stringify(filters) !== JSON.stringify(appliedFilters);
    setHasUnappliedChanges(hasChanges);
  }, [filters, appliedFilters]);

  // Apply filters manually
  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setHasUnappliedChanges(false);
  };

  // Handle slider changes (immediate visual feedback, delayed API call)
  const handleSliderChange = (key, value, immediate = false) => {
    setSliderValues(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));

    if (immediate) {
      handleFilterChange(key, value.toString());
    }
  };

  // Apply slider values when user stops dragging (but don't trigger API call yet)
  const applySliderValues = () => {
    if (sliderValues.priceMin !== parseInt(filters.priceMin || 500)) {
      handleFilterChange('priceMin', sliderValues.priceMin.toString());
    }
    if (sliderValues.priceMax !== parseInt(filters.priceMax || 3000)) {
      handleFilterChange('priceMax', sliderValues.priceMax.toString());
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value) => {
    setFilters(prev => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  const handlePriceRangeChange = (range) => {
    if (range === '5000+') {
      setFilters(prev => ({
        ...prev,
        priceMin: '5000',
        priceMax: ''
      }));
    } else {
      const [min, max] = range.split('-');
      setFilters(prev => ({
        ...prev,
        priceMin: min,
        priceMax: max
      }));
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      searchText: '',
      priceMin: '',
      priceMax: '',
      location: '',
      category: '',
      experienceTypes: [],
      duration: '',
      services: []
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSliderValues({ priceMin: 500, priceMax: 3000 });
    setHasUnappliedChanges(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.location) count++;
    if (filters.category) count++;
    if (filters.experienceTypes.length > 0) count++;
    if (filters.duration) count++;
    if (filters.services.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '24px'
    }}>
      {/* Search Bar */}
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '20px', 
            height: '20px', 
            color: '#6b7280' 
          }} />
          <input
            type="text"
            placeholder="Search health packages, treatments, or destinations..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isExpanded ? '#2563eb' : '#f3f4f6',
              color: isExpanded ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Filter style={{ width: '16px', height: '16px' }} />
            Advanced Filters
            {activeFilterCount > 0 && (
              <span style={{
                backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : '#2563eb',
                color: isExpanded ? 'white' : 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Apply Filters Button */}
            {hasUnappliedChanges && (
              <button
                onClick={applyFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Apply Filters
              </button>
            )}

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          padding: '20px',
          background: '#f9fafb'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            
            {/* Budget Slider */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                <DollarSign style={{ width: '16px', height: '16px' }} />
                Budget Range
              </label>
              
              {/* Price Display */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>
                  €{sliderValues.priceMin}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>to</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>
                  {sliderValues.priceMax >= 5000 ? '€5000+' : `€${sliderValues.priceMax}`}
                </span>
              </div>

              {/* Dual Range Slider */}
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                {/* Track */}
                <div style={{
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  position: 'relative'
                }}>
                  {/* Active Track */}
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    backgroundColor: '#2563eb',
                    borderRadius: '3px',
                    left: `${(Math.min(sliderValues.priceMin, SLIDER_MAX) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN) * 100}%`,
                    right: `${100 - (Math.min(sliderValues.priceMax, SLIDER_MAX) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN) * 100}%`
                  }}></div>
                </div>

                {/* Max Range Input - Put this first so it renders underneath */}
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step="100"
                  value={Math.min(sliderValues.priceMax, SLIDER_MAX)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= sliderValues.priceMin) {
                      handleSliderChange('priceMax', value);
                    }
                  }}
                  onMouseUp={applySliderValues}
                  onTouchEnd={applySliderValues}
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '0',
                    width: '100%',
                    height: '10px',
                    background: 'transparent',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    zIndex: 1,
                    pointerEvents: 'auto'
                  }}
                  className="slider-thumb-max"
                />

                {/* Min Range Input - Put this second so it renders on top */}
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step="100"
                  value={Math.min(sliderValues.priceMin, SLIDER_MAX)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value <= sliderValues.priceMax) {
                      handleSliderChange('priceMin', value);
                    }
                  }}
                  onMouseUp={applySliderValues}
                  onTouchEnd={applySliderValues}
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '0',
                    width: '100%',
                    height: '10px',
                    background: 'transparent',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                  className="slider-thumb-min"
                />
              </div>
              
              {/* Custom range slider container for better control */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '20px',
                  marginTop: '-20px',
                  zIndex: 3
                }}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = (e.clientX - rect.left) / rect.width;
                  const value = SLIDER_MIN + (percentage * (SLIDER_MAX - SLIDER_MIN));
                  
                  // Determine which handle to move based on proximity
                  const distToMin = Math.abs(value - sliderValues.priceMin);
                  const distToMax = Math.abs(value - sliderValues.priceMax);
                  
                  if (distToMin < distToMax) {
                    // Move min handle
                    const newValue = Math.max(SLIDER_MIN, Math.min(value, sliderValues.priceMax));
                    handleSliderChange('priceMin', Math.round(newValue / 100) * 100);
                  } else {
                    // Move max handle
                    const newValue = Math.max(sliderValues.priceMin, Math.min(value, SLIDER_MAX));
                    handleSliderChange('priceMax', Math.round(newValue / 100) * 100);
                  }
                  
                  setTimeout(applySliderValues, 100);
                }}
              />

              {/* Custom CSS for slider thumbs */}
              <style jsx>{`
                .slider-thumb-min::-webkit-slider-thumb,
                .slider-thumb-max::-webkit-slider-thumb {
                  appearance: none;
                  height: 18px;
                  width: 18px;
                  border-radius: 50%;
                  background: #2563eb;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  position: relative;
                }

                .slider-thumb-min::-moz-range-thumb,
                .slider-thumb-max::-moz-range-thumb {
                  height: 18px;
                  width: 18px;
                  border-radius: 50%;
                  background: #2563eb;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  position: relative;
                }

                /* Different colors for min and max thumbs for better visibility */
                .slider-thumb-min::-webkit-slider-thumb {
                  background: #1d4ed8;
                }

                .slider-thumb-max::-webkit-slider-thumb {
                  background: #2563eb;
                }

                .slider-thumb-min::-moz-range-thumb {
                  background: #1d4ed8;
                }

                .slider-thumb-max::-moz-range-thumb {
                  background: #2563eb;
                }

                /* Hide default track */
                .slider-thumb-min::-webkit-slider-track,
                .slider-thumb-max::-webkit-slider-track {
                  background: transparent;
                  border: none;
                }

                .slider-thumb-min::-moz-range-track,
                .slider-thumb-max::-moz-range-track {
                  background: transparent;
                  border: none;
                }
              `}</style>

              {/* Quick Budget Options */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {[
                  { min: 500, max: 1000, label: '€500-1K' },
                  { min: 1000, max: 2000, label: '€1K-2K' },
                  { min: 2000, max: 4000, label: '€2K-4K' },
                  { min: 4000, max: 15000, label: '€4K+' }
                ].map(range => (
                  <button
                    key={`${range.min}-${range.max}`}
                    onClick={() => {
                      // Handle the special case for 3K+ properly
                      const newMin = range.min;
                      const newMax = range.max;
                      
                      setSliderValues({
                        priceMin: newMin,
                        priceMax: newMax
                      });
                      handleFilterChange('priceMin', newMin.toString());
                      if (range.label === '€4K+') {
                        // For 4K+, set max to empty to indicate "no upper limit"
                        handleFilterChange('priceMax', '');
                      } else {
                        handleFilterChange('priceMax', newMax.toString());
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: (
                        parseInt(filters.priceMin) === range.min && 
                        (range.label === '€4K+' ? !filters.priceMax : parseInt(filters.priceMax) === range.max)
                      ) ? '#2563eb' : '#f1f5f9',
                      color: (
                        parseInt(filters.priceMin) === range.min && 
                        (range.label === '€4K+' ? !filters.priceMax : parseInt(filters.priceMax) === range.max)
                      ) ? 'white' : '#475569',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                <MapPin style={{ width: '16px', height: '16px' }} />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>


            {/* Duration */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                <Clock style={{ width: '16px', height: '16px' }} />
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Any Duration</option>
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Availability */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                <CalendarDays style={{ width: '16px', height: '16px' }} />
                Travel Dates
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Start Date */}
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateAvailability?.startDate || ''}
                    onChange={(e) => handleFilterChange('dateAvailability', {
                      ...filters.dateAvailability,
                      startDate: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]} // Bugünden itibaren
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateAvailability?.endDate || ''}
                    onChange={(e) => handleFilterChange('dateAvailability', {
                      ...filters.dateAvailability,
                      endDate: e.target.value
                    })}
                    min={filters.dateAvailability?.startDate || new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {/* Flexible Dates Checkbox */}
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '12px', 
                  color: '#6b7280',
                  marginTop: '4px' 
                }}>
                  <input
                    type="checkbox"
                    checked={filters.dateAvailability?.flexible || false}
                    onChange={(e) => handleFilterChange('dateAvailability', {
                      ...filters.dateAvailability,
                      flexible: e.target.checked
                    })}
                    style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                  />
                  My dates are flexible
                </label>

                {/* Quick Date Options */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                  {[
                    { label: 'This Month', days: 30 },
                    { label: 'Next Month', days: 60 },
                    { label: 'Next 3 Months', days: 90 }
                  ].map(({ label, days }) => (
                    <button
                      key={label}
                      onClick={() => {
                        const startDate = new Date();
                        const endDate = new Date();
                        endDate.setDate(startDate.getDate() + days);
                        
                        handleFilterChange('dateAvailability', {
                          startDate: startDate.toISOString().split('T')[0],
                          endDate: endDate.toISOString().split('T')[0],
                          flexible: true
                        });
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Category */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              <Tag style={{ width: '16px', height: '16px' }} />
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange('category', 
                    filters.category === category.value ? '' : category.value
                  )}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filters.category === category.value ? '#2563eb' : 'white',
                    color: filters.category === category.value ? 'white' : '#374151',
                    border: '1px solid ' + (filters.category === category.value ? '#2563eb' : '#d1d5db'),
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: filters.category === category.value ? '600' : '400'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Types */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              <Users style={{ width: '16px', height: '16px' }} />
              Experience Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {experienceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleArrayFilterChange('experienceTypes', type)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filters.experienceTypes.includes(type) ? '#16a34a' : 'white',
                    color: filters.experienceTypes.includes(type) ? 'white' : '#374151',
                    border: '1px solid ' + (filters.experienceTypes.includes(type) ? '#16a34a' : '#d1d5db'),
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: filters.experienceTypes.includes(type) ? '600' : '400'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              <Tag style={{ width: '16px', height: '16px' }} />
              Included Services
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularServices.map(service => (
                <button
                  key={service}
                  onClick={() => handleArrayFilterChange('services', service)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: filters.services.includes(service) ? '#7c3aed' : 'white',
                    color: filters.services.includes(service) ? 'white' : '#374151',
                    border: '1px solid ' + (filters.services.includes(service) ? '#7c3aed' : '#d1d5db'),
                    borderRadius: '16px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: filters.services.includes(service) ? '500' : '400'
                  }}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
