const asyncHandler = require('../middleware/asyncHandler');
const { createMessage, getMessages, markMessagesAsRead } = require('../services/messageService');
const Conversation = require('../models/Conversation');

// @desc    Get messages for a conversation (paginated)
// @route   GET /api/messages/:conversationId
const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  // Verify user is part of conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
    });
  }

  if (!conversation.participants.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this conversation',
    });
  }

  // Mark messages as read when fetching
  await markMessagesAsRead(conversationId, req.user._id);

  const result = await getMessages(conversationId, page, limit);

  res.status(200).json({
    success: true,
    data: result.messages,
    pagination: result.pagination,
  });
});

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, receiverId, content, type } = req.body;

  if (!conversationId || !receiverId || !content) {
    return res.status(400).json({
      success: false,
      message: 'conversationId, receiverId, and content are required',
    });
  }

  // Verify user is part of conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
    });
  }

  if (!conversation.participants.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to send messages in this conversation',
    });
  }

  const message = await createMessage({
    conversationId,
    senderId: req.user._id,
    receiverId,
    content,
    type,
  });

  res.status(201).json({
    success: true,
    data: message,
  });
});

module.exports = { getConversationMessages, sendMessage };
