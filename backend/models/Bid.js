const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for better query performance
bidSchema.index({ jobId: 1, status: 1 })
bidSchema.index({ freelancerId: 1 })
bidSchema.index({ createdAt: -1 })

// Ensure one bid per freelancer per job
bidSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true })

module.exports = mongoose.model('Bid', bidSchema)
