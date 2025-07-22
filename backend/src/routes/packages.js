const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect, authorize } = require('../middleware/auth');

// Admin routes MUST come before parameterized routes
// @desc    Get all packages (admin endpoint - includes inactive packages)
// @route   GET /api/packages/admin/all
// @access  Private/Admin
router.get('/admin/all', async (req, res) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      experienceTypes,
      services,
      page = 1,
      limit = 50,
      sort = '-createdAt',
      includeInactive = 'true'
    } = req.query;

    // Build query - admin can see all packages including inactive
    let query = {};

    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = Number(maxPrice);
    }

    if (experienceTypes) {
      const types = Array.isArray(experienceTypes) ? experienceTypes : [experienceTypes];
      query.experienceTypes = { $in: types };
    }

    if (services) {
      const serviceList = Array.isArray(services) ? services : [services];
      query['services.name'] = { $in: serviceList };
    }

    // Execute query
    const packages = await Package.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Package.countDocuments(query);

    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: packages
    });
  } catch (error) {
    console.error('Error fetching admin packages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin packages'
    });
  }
});

// @desc    Get featured packages
// @route   GET /api/packages/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const packages = await Package.find({
      isActive: true,
      isFeatured: true
    })
      .sort('-rating.average')
      .limit(4);

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured packages'
    });
  }
});

// Re-route into other resource routers
const reviewRouter = require('./reviews');
router.use('/:packageId/reviews', reviewRouter);

// @desc    Get all packages with advanced filtering
// @route   GET /api/packages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      searchText,
      category,
      location,
      priceMin,
      priceMax,
      experienceTypes,
      services,
      duration,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Text search across multiple fields
    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { 'location.city': { $regex: searchText, $options: 'i' } },
        { 'location.country': { $regex: searchText, $options: 'i' } },
        { 'medicalFacility.name': { $regex: searchText, $options: 'i' } },
        { tags: { $regex: searchText, $options: 'i' } },
        { category: { $regex: searchText, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    // Location filtering (parse "City, Country" format)
    if (location && !searchText) {
      if (location.includes(',')) {
        const [city, country] = location.split(',').map(s => s.trim());
        query.$and = [
          { 'location.city': { $regex: city, $options: 'i' } },
          { 'location.country': { $regex: country, $options: 'i' } }
        ];
      } else {
        query.$or = [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.country': { $regex: location, $options: 'i' } }
        ];
      }
    }

    // Price range filtering with debug
    console.log('Price filtering params:', { priceMin, priceMax });
    if (priceMin || priceMax) {
      query['pricing.basePrice'] = {};
      if (priceMin) query['pricing.basePrice'].$gte = Number(priceMin);
      if (priceMax) query['pricing.basePrice'].$lte = Number(priceMax);
      console.log('Price query:', query['pricing.basePrice']);
    }

    // Experience types filtering
    if (experienceTypes) {
      const types = Array.isArray(experienceTypes) ? experienceTypes : [experienceTypes];
      query.experienceTypes = { $in: types };
    }

    // Services filtering
    if (services) {
      const serviceList = Array.isArray(services) ? services : [services];
      query['services.name'] = { $in: serviceList };
    }

    // Duration filtering
    if (duration) {
      if (duration === '1-3') {
        query['duration.days'] = { $gte: 1, $lte: 3 };
      } else if (duration === '4-7') {
        query['duration.days'] = { $gte: 4, $lte: 7 };
      } else if (duration === '8-14') {
        query['duration.days'] = { $gte: 8, $lte: 14 };
      } else if (duration === '15+') {
        query['duration.days'] = { $gte: 15 };
      }
    }


    // Execute query
    const packages = await Package.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Package.countDocuments(query);

    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: packages,
      filters: {
        searchText,
        category,
        location,
        priceMin,
        priceMax,
        experienceTypes,
        services,
        duration
      }
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching packages'
    });
  }
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('reviews');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching package'
    });
  }
});

// @desc    Create new package
// @route   POST /api/packages
// @access  Public (temporarily for testing)
router.post('/', async (req, res) => {
  try {
    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Public (temporarily for testing)
router.put('/:id', async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Public (temporarily for testing)
router.delete('/:id', async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting package'
    });
  }
});


module.exports = router;
