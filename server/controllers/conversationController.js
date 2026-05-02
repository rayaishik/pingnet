const asyncHandler = require('../middleware/asyncHandler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user's conversations
// @route   GET /api/conversations
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate('participants', 'username email avatar onlineStatus lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  // Add unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        receiverId: req.user._id,
        read: false,
      });

      return {
        ...conv.toObject(),
        unreadCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: conversationsWithUnread,
  });
});

// @desc    Create or get existing conversation
// @route   POST /api/conversations
const createConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    return res.status(400).json({
      success: false,
      message: 'Participant ID is required',
    });
  }

  if (participantId === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot create conversation with yourself',
    });
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId], $size: 2 },
  })
    .populate('participants', 'username email avatar onlineStatus lastSeen')
    .populate('lastMessage');

  if (conversation) {
    return res.status(200).json({
      success: true,
      data: conversation,
    });
  }

  // Create new conversation
  conversation = await Conversation.create({
    participants: [req.user._id, participantId],
  });

  conversation = await Conversation.findById(conversation._id)
    .populate('participants', 'username email avatar onlineStatus lastSeen')
    .populate('lastMessage');

  res.status(201).json({
    success: true,
    data: conversation,
  });
});

module.exports = { getConversations, createConversation };
