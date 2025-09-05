const express = require('express')
const { body, validationResult, query } = require('express-validator')
const User = require('../models/User')
const { auth } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/users/freelancers
// @desc    Get all freelancers with filters
// @access  Public
router.get('/freelancers', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('skill').optional().isString().withMessage('Skill must be a string'),
  query('minRating').optional().isNumeric().withMessage('Min rating must be a number'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = { role: 'freelancer', isActive: true }
    
    if (req.query.skill) {
      filter['profile.skills'] = { $in: [new RegExp(req.query.skill, 'i')] }
    }
    
    if (req.query.minRating) {
      filter.rating = { $gte: parseFloat(req.query.minRating) }
    }

    // Search in name and bio
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'profile.bio': { $regex: req.query.search, $options: 'i' } }
      ]
    }

    const freelancers = await User.find(filter)
      .select('-password')
      .sort({ rating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(filter)

    res.json({
      freelancers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalFreelancers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get freelancers error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/users/:id/availability
// @desc    Update user availability
// @access  Private
router.put('/:id/availability', auth, [
  body('availability').isIn(['available', 'busy', 'unavailable']).withMessage('Invalid availability status')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { availability } = req.body
    const userId = req.params.id

    // Check if user is updating their own profile
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { 'profile.availability': availability } },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'Availability updated successfully',
      user
    })
  } catch (error) {
    console.error('Update availability error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
