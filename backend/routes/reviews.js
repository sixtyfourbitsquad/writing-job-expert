const express = require('express')
const { body, validationResult } = require('express-validator')
const Review = require('../models/Review')
const Job = require('../models/Job')
const User = require('../models/User')
const { auth } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').trim().isLength({ min: 10, max: 1000 }).withMessage('Feedback must be between 10 and 1000 characters'),
  body('categories.communication').isInt({ min: 1, max: 5 }).withMessage('Communication rating must be between 1 and 5'),
  body('categories.quality').isInt({ min: 1, max: 5 }).withMessage('Quality rating must be between 1 and 5'),
  body('categories.timeliness').isInt({ min: 1, max: 5 }).withMessage('Timeliness rating must be between 1 and 5'),
  body('categories.professionalism').isInt({ min: 1, max: 5 }).withMessage('Professionalism rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { jobId, rating, feedback, categories } = req.body

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user is the job owner
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to review this job' })
    }

    // Check if job is completed
    if (job.status !== 'completed') {
      return res.status(400).json({ message: 'Job must be completed to leave a review' })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ jobId })
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this job' })
    }

    const review = new Review({
      jobId,
      clientId: req.user.userId,
      freelancerId: job.freelancerId,
      rating,
      feedback,
      categories
    })

    await review.save()

    // Update freelancer's rating
    await updateFreelancerRating(job.freelancerId)

    const populatedReview = await Review.findById(review._id)
      .populate('clientId', 'name profilePicture')
      .populate('freelancerId', 'name profilePicture')

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    })
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/reviews/freelancer/:freelancerId
// @desc    Get reviews for a freelancer
// @access  Public
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ 
      freelancerId: req.params.freelancerId,
      isPublic: true 
    })
      .populate('clientId', 'name profilePicture')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments({ 
      freelancerId: req.params.freelancerId,
      isPublic: true 
    })

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/reviews/:id/response
// @desc    Add response to a review
// @access  Private
router.post('/:id/response', auth, [
  body('content').trim().isLength({ min: 10, max: 500 }).withMessage('Response must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { content } = req.body
    const reviewId = req.params.id

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user is the freelancer being reviewed
    if (review.freelancerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to respond to this review' })
    }

    review.response = {
      content,
      createdAt: new Date()
    }

    await review.save()

    res.json({
      message: 'Response added successfully',
      review
    })
  } catch (error) {
    console.error('Add response error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Helper function to update freelancer rating
async function updateFreelancerRating(freelancerId) {
  try {
    const reviews = await Review.find({ freelancerId, isPublic: true })
    
    if (reviews.length === 0) return

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await User.findByIdAndUpdate(freelancerId, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    })
  } catch (error) {
    console.error('Update freelancer rating error:', error)
  }
}

module.exports = router
