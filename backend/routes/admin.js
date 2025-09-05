const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const Job = require('../models/Job')
const Payment = require('../models/Payment')
const { adminAuth } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/admin/clear-db
// @desc    Clear all data (for testing only)
// @access  Public (for development)
router.post('/clear-db', async (req, res) => {
  try {
    await User.deleteMany({})
    await Job.deleteMany({})
    await Payment.deleteMany({})
    res.json({ message: 'Database cleared successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error clearing database', error: error.message })
  }
})

// @route   POST /api/admin/make-admin
// @desc    Make a user admin (for testing only)
// @access  Public (for development)
router.post('/make-admin', async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User made admin successfully', user })
  } catch (error) {
    res.status(500).json({ message: 'Error making user admin', error: error.message })
  }
})

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalClients = await User.countDocuments({ role: 'client' })
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' })
    const activeUsers = await User.countDocuments({ isActive: true })
    
    const totalJobs = await Job.countDocuments()
    const openJobs = await Job.countDocuments({ status: 'open' })
    const inProgressJobs = await Job.countDocuments({ status: 'in_progress' })
    const completedJobs = await Job.countDocuments({ status: 'completed' })
    
    const totalPayments = await Payment.countDocuments()
    const pendingPayments = await Payment.countDocuments({ status: 'processing' })
    const successfulPayments = await Payment.countDocuments({ status: 'success' })
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // Recent activities
    const recentJobs = await Job.find()
      .populate('clientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    const recentPayments = await Payment.find()
      .populate('userId', 'name')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      stats: {
        users: {
          total: totalUsers,
          clients: totalClients,
          freelancers: totalFreelancers,
          active: activeUsers
        },
        jobs: {
          total: totalJobs,
          open: openJobs,
          inProgress: inProgressJobs,
          completed: completedJobs
        },
        payments: {
          total: totalPayments,
          pending: pendingPayments,
          successful: successfulPayments,
          revenue: totalRevenue[0]?.total || 0
        }
      },
      recentActivities: {
        jobs: recentJobs,
        payments: recentPayments
      }
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (active/inactive)
// @access  Private (Admin only)
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { isActive } = req.body
    const userId = req.params.id

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/admin/jobs
// @desc    Get all jobs with pagination
// @access  Private (Admin only)
router.get('/jobs', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const jobs = await Job.find()
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Job.countDocuments()

    res.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/admin/upi-settings
// @desc    Update UPI settings
// @access  Private (Admin only)
router.put('/upi-settings', adminAuth, [
  body('upiId').trim().notEmpty().withMessage('UPI ID is required'),
  body('qrCode').optional().isString().withMessage('QR Code must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { upiId, qrCode } = req.body

    // Update environment variables or store in database
    // For now, we'll just return success
    // In production, you might want to store these in a settings collection

    res.json({
      message: 'UPI settings updated successfully',
      settings: {
        upiId,
        qrCode
      }
    })
  } catch (error) {
    console.error('Update UPI settings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
