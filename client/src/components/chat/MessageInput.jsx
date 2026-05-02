import React, { useState, useRef } from 'react';
import useSocketStore from '../../store/useSocketStore';

const MessageInput = ({ conversationId, receiverId, onSendMessage }) => {
  const [content, setContent] = useState('');
  const { socket } = useSocketStore();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef(null);

  const handleTyping = () => {
    if (!socket || !conversationId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', { conversationId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setContent('');

    // Stop typing indicator
    if (isTypingRef.current) {
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket?.emit('typing:stop', { conversationId });
    }

    // Re-focus input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <textarea
        ref={inputRef}
        className="message-input-field"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleTyping();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!content.trim()}
        title="Send message"
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
