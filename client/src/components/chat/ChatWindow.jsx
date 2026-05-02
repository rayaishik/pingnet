import React, { useEffect, useRef, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import LoadingSkeleton from '../common/LoadingSkeleton';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useSocketStore from '../../store/useSocketStore';
import { getOtherParticipant, generateAvatar } from '../../utils/helpers';

const ChatWindow = ({ onBack }) => {
  const { user } = useAuthStore();
  const {
    activeConversation,
    messages,
    pagination,
    loadingMessages,
    fetchMessages,
    addOptimisticMessage,
    markConversationRead,
  } = useChatStore();
  const { socket, onlineUsers, typingUsers } = useSocketStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const isInitialLoad = useRef(true);

  const otherUser = activeConversation
    ? getOtherParticipant(activeConversation.participants, user._id)
    : null;

  const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
  const typingInConversation = activeConversation
    ? (typingUsers[activeConversation._id] || []).filter((id) => id !== user._id)
    : [];

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      isInitialLoad.current = true;
      fetchMessages(activeConversation._id, 1);
      markConversationRead(activeConversation._id);

      // Join conversation room
      socket?.emit('join:conversation', {
        conversationId: activeConversation._id,
      });

      // Mark messages as read
      socket?.emit('message:read', {
        conversationId: activeConversation._id,
      });
    }
  }, [activeConversation?._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
      isInitialLoad.current = false;
      return;
    }
    // Auto scroll if near bottom
    const container = containerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMore && !loadingMessages && activeConversation) {
      const nextPage = (pagination.page || 1) + 1;
      fetchMessages(activeConversation._id, nextPage);
    }
  }, [pagination, loadingMessages, activeConversation]);

  const handleSendMessage = (content) => {
    if (!activeConversation || !otherUser || !socket) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      tempId,
      conversationId: activeConversation._id,
      senderId: { _id: user._id, username: user.username, avatar: user.avatar },
      receiverId: { _id: otherUser._id, username: otherUser.username },
      content,
      type: 'text',
      delivered: false,
      read: false,
      createdAt: new Date().toISOString(),
    };

    addOptimisticMessage(tempMessage);

    socket.emit('send:message', {
      conversationId: activeConversation._id,
      receiverId: otherUser._id,
      content,
      type: 'text',
      tempId,
    });
  };

  if (!activeConversation) {
    return (
      <div className="chat-main">
        <div className="no-chat-selected">
          <div className="no-chat-icon">💬</div>
          <h2 className="no-chat-title">Welcome to PingNet</h2>
          <p className="no-chat-text">
            Select a conversation from the sidebar or search for users to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      {/* Chat Header */}
      <div className="chat-header">
        <button className="chat-back-btn" onClick={onBack}>
          ←
        </button>
        <div className="avatar-wrapper">
          <img
            className="avatar"
            src={otherUser?.avatar || generateAvatar(otherUser?.username)}
            alt={otherUser?.username}
          />
          <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{otherUser?.username || 'Unknown'}</div>
          <div className={`chat-header-status ${isOnline ? 'online' : ''}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container" ref={containerRef}>
        {pagination?.hasMore && (
          <div className="load-more-container">
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMessages}
            >
              {loadingMessages ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}

        {loadingMessages && messages.length === 0 ? (
          <LoadingSkeleton type="message" count={8} />
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isSent={
                (msg.senderId?._id || msg.senderId) === user._id
              }
            />
          ))
        )}

        {typingInConversation.length > 0 && (
          <TypingIndicator username={otherUser?.username} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        conversationId={activeConversation._id}
        receiverId={otherUser?._id}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatWindow;
