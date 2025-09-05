const express = require('express')
const { body, validationResult } = require('express-validator')
const Message = require('../models/Message')
const { auth } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/messages/:roomId
// @desc    Get messages for a room
// @access  Private
router.get('/:roomId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('senderId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments({ roomId: req.params.roomId })

    res.json({
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('receiverId').isMongoId().withMessage('Valid receiver ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { roomId, receiverId, content, files = [] } = req.body

    const message = new Message({
      roomId,
      senderId: req.user.userId,
      receiverId,
      content,
      files
    })

    await message.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name profilePicture')

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    // Check if user is the receiver
    if (message.receiverId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    message.isRead = true
    message.readAt = new Date()
    await message.save()

    res.json({ message: 'Message marked as read' })
  } catch (error) {
    console.error('Mark message read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
