const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true,
    maxlength: 1000
  },
  categories: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  response: {
    content: String,
    createdAt: Date
  }
}, {
  timestamps: true
})

// Index for better query performance
reviewSchema.index({ freelancerId: 1, createdAt: -1 })
reviewSchema.index({ clientId: 1 })
reviewSchema.index({ jobId: 1 })
reviewSchema.index({ rating: 1 })

// Ensure one review per job
reviewSchema.index({ jobId: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema)
