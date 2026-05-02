const events = require('./events');
const { createMessage, markMessagesAsRead, markMessagesAsDelivered, getUnreadCount } = require('../services/messageService');
const { setUserOnline, setUserOffline, getUserSocketId, getOnlineUsers } = require('../redis/onlineUsers');
const { saveSession, deleteSession } = require('../redis/sessionStore');
const { pushNotification } = require('../services/notificationService');
const { publish } = require('../redis/pubsub');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const registerHandlers = (io, socket) => {
  const userId = socket.userId;

  // Handle user coming online
  const handleUserOnline = async () => {
    try {
      await setUserOnline(userId, socket.id);
      await saveSession(userId, { socketId: socket.id, connectedAt: new Date() });
      await User.findByIdAndUpdate(userId, { onlineStatus: true });

      // Broadcast to all connected clients
      socket.broadcast.emit(events.USER_STATUS_ONLINE, { userId });

      // Send list of online users to the newly connected user
      const onlineUsers = await getOnlineUsers();
      socket.emit('online:users', onlineUsers);

      // Deliver any undelivered messages
      const conversations = await Conversation.find({ participants: userId });
      for (const conv of conversations) {
        await markMessagesAsDelivered(conv._id.toString(), userId);
      }

      console.log(`🟢 User ${userId} is online (socket: ${socket.id})`);
    } catch (error) {
      console.error('Error in handleUserOnline:', error.message);
    }
  };

  // Handle joining a conversation room
  const handleJoinConversation = async ({ conversationId }) => {
    try {
      socket.join(conversationId);

      // Mark messages as read when joining
      await markMessagesAsRead(conversationId, userId);

      // Notify sender that messages were read
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== userId
        );
        if (otherParticipant) {
          const otherSocketId = await getUserSocketId(otherParticipant.toString());
          if (otherSocketId) {
            io.to(otherSocketId).emit(events.MESSAGE_READ_RECEIPT, {
              conversationId,
              readBy: userId,
            });
          }
        }
      }

      console.log(`📌 User ${userId} joined conversation ${conversationId}`);
    } catch (error) {
      console.error('Error in handleJoinConversation:', error.message);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (data) => {
    try {
      const { conversationId, receiverId, content, type, tempId } = data;

      // Save message to database
      const message = await createMessage({
        conversationId,
        senderId: userId,
        receiverId,
        content,
        type: type || 'text',
      });

      // Emit to conversation room (including sender for confirmation)
      io.to(conversationId).emit(events.RECEIVE_MESSAGE, {
        message,
        tempId,
      });

      // If receiver is online but not in the room, send directly
      const receiverSocketId = await getUserSocketId(receiverId);
      if (receiverSocketId) {
        // Mark as delivered
        await Message.findByIdAndUpdate(message._id, { delivered: true });

        io.to(receiverSocketId).emit(events.RECEIVE_MESSAGE, {
          message: { ...message.toObject(), delivered: true },
          tempId,
        });

        // Send delivery receipt to sender
        socket.emit(events.MESSAGE_DELIVERED, {
          messageId: message._id,
          conversationId,
        });

        // Update unread count for receiver
        const unreadCount = await getUnreadCount(receiverId, conversationId);
        io.to(receiverSocketId).emit(events.UNREAD_UPDATE, {
          conversationId,
          unreadCount,
        });
      } else {
        // Receiver is offline, queue notification
        await pushNotification(receiverId, {
          type: 'new_message',
          from: userId,
          conversationId,
          preview: content.substring(0, 100),
        });
      }

      // Publish to Redis for multi-server support
      await publish('new_message', {
        message,
        conversationId,
        receiverId,
        tempId,
      });

    } catch (error) {
      console.error('Error in handleSendMessage:', error.message);
      socket.emit('error', { message: 'Failed to send message' });
    }
  };

  // Handle typing start
  const handleTypingStart = ({ conversationId }) => {
    socket.to(conversationId).emit(events.USER_TYPING, {
      userId,
      conversationId,
      isTyping: true,
    });
  };

  // Handle typing stop
  const handleTypingStop = ({ conversationId }) => {
    socket.to(conversationId).emit(events.USER_TYPING, {
      userId,
      conversationId,
      isTyping: false,
    });
  };

  // Handle message read
  const handleMessageRead = async ({ conversationId }) => {
    try {
      await markMessagesAsRead(conversationId, userId);

      // Notify the other participant
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== userId
        );
        if (otherParticipant) {
          const otherSocketId = await getUserSocketId(otherParticipant.toString());
          if (otherSocketId) {
            io.to(otherSocketId).emit(events.MESSAGE_READ_RECEIPT, {
              conversationId,
              readBy: userId,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in handleMessageRead:', error.message);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await setUserOffline(userId, socket.id);
      await deleteSession(userId);
      await User.findByIdAndUpdate(userId, {
        onlineStatus: false,
        lastSeen: new Date(),
      });

      socket.broadcast.emit(events.USER_STATUS_OFFLINE, {
        userId,
        lastSeen: new Date(),
      });

      console.log(`🔴 User ${userId} disconnected`);
    } catch (error) {
      console.error('Error in handleDisconnect:', error.message);
    }
  };

  // Register all event handlers
  socket.on(events.USER_ONLINE, handleUserOnline);
  socket.on(events.JOIN_CONVERSATION, handleJoinConversation);
  socket.on(events.SEND_MESSAGE, handleSendMessage);
  socket.on(events.TYPING_START, handleTypingStart);
  socket.on(events.TYPING_STOP, handleTypingStop);
  socket.on(events.MESSAGE_READ, handleMessageRead);
  socket.on('disconnect', handleDisconnect);

  // Auto-emit online on connect
  handleUserOnline();
};

module.exports = { registerHandlers };
