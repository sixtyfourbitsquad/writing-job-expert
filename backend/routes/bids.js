const express = require('express')
const { body, validationResult } = require('express-validator')
const Bid = require('../models/Bid')
const Job = require('../models/Job')
const { auth } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/bids
// @desc    Create a new bid
// @access  Private (Freelancer only)
router.post('/', auth, [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('deliveryTime').isInt({ min: 1 }).withMessage('Delivery time must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids' })
    }

    const { jobId, amount, message, deliveryTime } = req.body

    // Check if job exists and is open
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for bidding' })
    }

    // Check if freelancer already bid on this job
    const existingBid = await Bid.findOne({ jobId, freelancerId: req.user.userId })
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this job' })
    }

    // Check if freelancer is trying to bid on their own job
    if (job.clientId.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot bid on your own job' })
    }

    const bid = new Bid({
      jobId,
      freelancerId: req.user.userId,
      amount,
      message,
      deliveryTime
    })

    await bid.save()

    // Update job proposals count
    await Job.findByIdAndUpdate(jobId, { $inc: { proposals: 1 } })

    // Add bid to job's bids array
    await Job.findByIdAndUpdate(jobId, { $push: { bids: bid._id } })

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name profilePicture rating skills')

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: populatedBid
    })
  } catch (error) {
    console.error('Create bid error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/bids/job/:jobId
// @desc    Get all bids for a job
// @access  Private (Job owner only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view bids for this job' })
    }

    const bids = await Bid.find({ jobId: req.params.jobId })
      .populate('freelancerId', 'name profilePicture rating skills totalReviews completedJobs')
      .sort({ createdAt: -1 })

    res.json({ bids })
  } catch (error) {
    console.error('Get bids error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/bids/my-bids
// @desc    Get current user's bids
// @access  Private (Freelancer only)
router.get('/my-bids', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const bids = await Bid.find({ freelancerId: req.user.userId })
      .populate({
        path: 'jobId',
        select: 'title description budget deadline status category'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Bid.countDocuments({ freelancerId: req.user.userId })

    res.json({
      bids,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBids: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get my bids error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/bids/:id
// @desc    Update a bid
// @access  Private (Bid owner only)
router.put('/:id', auth, [
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('message').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('deliveryTime').optional().isInt({ min: 1 }).withMessage('Delivery time must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const bid = await Bid.findById(req.params.id)
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' })
    }

    // Check if user is the bid owner
    if (bid.freelancerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this bid' })
    }

    // Only allow updates if bid is still pending
    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update bid that is not pending' })
    }

    const updates = req.body
    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('freelancerId', 'name profilePicture rating skills')

    res.json({
      message: 'Bid updated successfully',
      bid: updatedBid
    })
  } catch (error) {
    console.error('Update bid error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/bids/:id
// @desc    Withdraw a bid
// @access  Private (Bid owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' })
    }

    // Check if user is the bid owner
    if (bid.freelancerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to withdraw this bid' })
    }

    // Only allow withdrawal if bid is still pending
    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw bid that is not pending' })
    }

    // Update bid status to withdrawn
    bid.status = 'withdrawn'
    await bid.save()

    // Decrease job proposals count
    await Job.findByIdAndUpdate(bid.jobId, { $inc: { proposals: -1 } })

    res.json({ message: 'Bid withdrawn successfully' })
  } catch (error) {
    console.error('Withdraw bid error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
