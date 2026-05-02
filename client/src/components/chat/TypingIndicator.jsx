import React from 'react';

const TypingIndicator = ({ username }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span>{username || 'Someone'} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
