const express = require('express')
const { body, validationResult, query } = require('express-validator')
const Job = require('../models/Job')
const Bid = require('../models/Bid')
const { auth } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('minBudget').optional().isNumeric().withMessage('Min budget must be a number'),
  query('maxBudget').optional().isNumeric().withMessage('Max budget must be a number'),
  query('status').optional().isIn(['open', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
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
    const filter = {}
    
    if (req.query.category) {
      filter.category = req.query.category
    }
    
    if (req.query.status) {
      filter.status = req.query.status
    } else {
      filter.status = 'open' // Default to open jobs
    }

    if (req.query.minBudget || req.query.maxBudget) {
      filter['budget.min'] = {}
      if (req.query.minBudget) {
        filter['budget.min'].$gte = parseFloat(req.query.minBudget)
      }
      if (req.query.maxBudget) {
        filter['budget.max'] = { $lte: parseFloat(req.query.maxBudget) }
      }
    }

    // Search in title and description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ]
    }

    const jobs = await Job.find(filter)
      .populate('clientId', 'name profilePicture rating')
      .populate('bids', 'amount freelancerId status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Job.countDocuments(filter)

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

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('clientId', 'name profilePicture rating totalReviews')
      .populate({
        path: 'bids',
        populate: {
          path: 'freelancerId',
          select: 'name profilePicture rating skills'
        }
      })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Increment view count
    job.views += 1
    await job.save()

    res.json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Client only)
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('category').isIn([
    'Web Development', 'Mobile Development', 'Design', 'Writing', 
    'Marketing', 'Data Science', 'DevOps', 'Other'
  ]).withMessage('Invalid category'),
  body('budget.min').isNumeric().withMessage('Min budget must be a number'),
  body('budget.max').isNumeric().withMessage('Max budget must be a number'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
  body('skills').isArray().withMessage('Skills must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { title, description, category, budget, deadline, skills, location = 'Remote' } = req.body

    // Check if user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create jobs' })
    }

    const job = new Job({
      title,
      description,
      clientId: req.user.userId,
      category,
      budget,
      deadline: new Date(deadline),
      skills,
      location
    })

    await job.save()

    const populatedJob = await Job.findById(job._id)
      .populate('clientId', 'name profilePicture rating')

    res.status(201).json({
      message: 'Job created successfully',
      job: populatedJob
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Client only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' })
    }

    // Only allow updates if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Cannot update job that is not open' })
    }

    const updates = req.body
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('clientId', 'name profilePicture rating')

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    })
  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Client only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' })
    }

    // Only allow deletion if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Cannot delete job that is not open' })
    }

    // Delete associated bids
    await Bid.deleteMany({ jobId: req.params.id })

    await Job.findByIdAndDelete(req.params.id)

    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/jobs/:id/select-freelancer
// @desc    Select a freelancer for a job
// @access  Private (Client only)
router.post('/:id/select-freelancer', auth, [
  body('bidId').isMongoId().withMessage('Valid bid ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { bidId } = req.body
    const jobId = req.params.id

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const bid = await Bid.findById(bidId)
    if (!bid || bid.jobId.toString() !== jobId) {
      return res.status(404).json({ message: 'Bid not found' })
    }

    // Update job
    job.freelancerId = bid.freelancerId
    job.selectedBid = bidId
    job.status = 'in_progress'
    await job.save()

    // Update bid status
    bid.status = 'accepted'
    await bid.save()

    // Reject other bids
    await Bid.updateMany(
      { jobId, _id: { $ne: bidId } },
      { status: 'rejected' }
    )

    res.json({ message: 'Freelancer selected successfully' })
  } catch (error) {
    console.error('Select freelancer error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
