const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const createMessage = async ({ conversationId, senderId, receiverId, content, type = 'text' }) => {
  const message = await Message.create({
    conversationId,
    senderId,
    receiverId,
    content,
    type,
  });

  // Update conversation's last message
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  // Populate sender info
  const populated = await Message.findById(message._id)
    .populate('senderId', 'username avatar')
    .populate('receiverId', 'username avatar');

  return populated;
};

const getMessages = async (conversationId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'username avatar')
    .populate('receiverId', 'username avatar')
    .lean();

  const total = await Message.countDocuments({ conversationId });

  return {
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    },
  };
};

const markMessagesAsRead = async (conversationId, userId) => {
  await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      read: false,
    },
    { read: true }
  );
};

const markMessagesAsDelivered = async (conversationId, userId) => {
  await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      delivered: false,
    },
    { delivered: true }
  );
};

const getUnreadCount = async (userId, conversationId) => {
  return await Message.countDocuments({
    conversationId,
    receiverId: userId,
    read: false,
  });
};

module.exports = {
  createMessage,
  getMessages,
  markMessagesAsRead,
  markMessagesAsDelivered,
  getUnreadCount,
};
