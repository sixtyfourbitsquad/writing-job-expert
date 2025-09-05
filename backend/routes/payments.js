const express = require('express')
const { body, validationResult } = require('express-validator')
const Payment = require('../models/Payment')
const Job = require('../models/Job')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/payments/create
// @desc    Create a new payment
// @access  Private
router.post('/create', auth, [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { jobId, amount } = req.body

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to create payment for this job' })
    }

    // Check if job is in progress
    if (job.status !== 'in_progress') {
      return res.status(400).json({ message: 'Job must be in progress to create payment' })
    }

    // Check if payment already exists for this job
    const existingPayment = await Payment.findOne({ jobId })
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this job' })
    }

    // Get admin UPI details (you might want to store these in environment variables)
    const upiId = process.env.ADMIN_UPI_ID || 'admin@paytm'
    const qrCode = process.env.ADMIN_QR_CODE_URL || ''

    const payment = new Payment({
      userId: req.user.userId,
      jobId,
      amount,
      upiId,
      qrCode,
      status: 'pending'
    })

    await payment.save()

    res.status(201).json({
      message: 'Payment created successfully',
      payment: {
        id: payment._id,
        amount: payment.amount,
        upiId: payment.upiId,
        qrCode: payment.qrCode,
        status: payment.status,
        createdAt: payment.createdAt
      }
    })
  } catch (error) {
    console.error('Create payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/payments/:id/submit-utr
// @desc    Submit UTR number for payment verification
// @access  Private
router.post('/:id/submit-utr', auth, [
  body('utrNumber').trim().notEmpty().withMessage('UTR number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { utrNumber } = req.body
    const paymentId = req.params.id

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // Check if user is the payment owner
    if (payment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this payment' })
    }

    // Check if payment is still pending
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment is not pending' })
    }

    // Check if UTR number already exists
    const existingPayment = await Payment.findOne({ utrNumber })
    if (existingPayment && existingPayment._id.toString() !== paymentId) {
      return res.status(400).json({ message: 'UTR number already exists' })
    }

    payment.utrNumber = utrNumber
    payment.status = 'processing'
    await payment.save()

    res.json({
      message: 'UTR number submitted successfully. Payment is under verification.',
      payment: {
        id: payment._id,
        status: payment.status,
        utrNumber: payment.utrNumber
      }
    })
  } catch (error) {
    console.error('Submit UTR error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/payments/my-payments
// @desc    Get current user's payments
// @access  Private
router.get('/my-payments', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const payments = await Payment.find({ userId: req.user.userId })
      .populate('jobId', 'title description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Payment.countDocuments({ userId: req.user.userId })

    res.json({
      payments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get payments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/payments/pending
// @desc    Get all pending payments (Admin only)
// @access  Private (Admin only)
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const payments = await Payment.find({ status: 'processing' })
      .populate('userId', 'name email')
      .populate('jobId', 'title description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Payment.countDocuments({ status: 'processing' })

    res.json({
      payments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get pending payments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/payments/:id/verify
// @desc    Verify payment (Admin only)
// @access  Private (Admin only)
router.put('/:id/verify', adminAuth, [
  body('status').isIn(['success', 'failed']).withMessage('Status must be success or failed'),
  body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { status, adminNotes, failureReason } = req.body
    const paymentId = req.params.id

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // Check if payment is in processing status
    if (payment.status !== 'processing') {
      return res.status(400).json({ message: 'Payment is not in processing status' })
    }

    payment.status = status
    payment.processedBy = req.user.userId
    payment.processedAt = new Date()
    
    if (adminNotes) {
      payment.adminNotes = adminNotes
    }
    
    if (status === 'failed' && failureReason) {
      payment.failureReason = failureReason
    }

    await payment.save()

    // If payment is successful, update job status
    if (status === 'success') {
      await Job.findByIdAndUpdate(payment.jobId, { status: 'completed' })
    }

    res.json({
      message: `Payment ${status} successfully`,
      payment: {
        id: payment._id,
        status: payment.status,
        processedAt: payment.processedAt
      }
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/payments/stats
// @desc    Get payment statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments()
    const pendingPayments = await Payment.countDocuments({ status: 'processing' })
    const successfulPayments = await Payment.countDocuments({ status: 'success' })
    const failedPayments = await Payment.countDocuments({ status: 'failed' })
    
    const totalAmount = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    res.json({
      totalPayments,
      pendingPayments,
      successfulPayments,
      failedPayments,
      totalRevenue: totalAmount[0]?.total || 0
    })
  } catch (error) {
    console.error('Get payment stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
