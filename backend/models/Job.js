const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Design',
      'Writing',
      'Marketing',
      'Data Science',
      'DevOps',
      'Other'
    ]
  },
  skills: [{
    type: String,
    trim: true
  }],
  budget: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed'
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  location: {
    type: String,
    default: 'Remote'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  selectedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    default: null
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  proposals: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for better query performance
jobSchema.index({ status: 1, createdAt: -1 })
jobSchema.index({ category: 1, status: 1 })
jobSchema.index({ clientId: 1 })
jobSchema.index({ freelancerId: 1 })

module.exports = mongoose.model('Job', jobSchema)
