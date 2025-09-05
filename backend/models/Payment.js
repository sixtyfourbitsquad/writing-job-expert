const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'bank_transfer', 'wallet'],
    default: 'upi'
  },
  upiId: {
    type: String,
    trim: true
  },
  qrCode: {
    type: String,
    default: ''
  },
  utrNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  adminNotes: {
    type: String,
    maxlength: 500
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
})

// Index for better query performance
paymentSchema.index({ userId: 1, status: 1 })
paymentSchema.index({ jobId: 1 })
paymentSchema.index({ status: 1, createdAt: -1 })
paymentSchema.index({ utrNumber: 1 })

module.exports = mongoose.model('Payment', paymentSchema)
