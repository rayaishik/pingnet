import React from 'react';
import { formatMessageTime } from '../../utils/helpers';

const MessageBubble = ({ message, isSent }) => {
  return (
    <div className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        <div className="message-content">{message.content}</div>
        <div className="message-meta">
          <span className="message-time">
            {formatMessageTime(message.createdAt)}
          </span>
          {isSent && (
            <span
              className={`message-status ${
                message.read ? 'read' : message.delivered ? 'delivered' : ''
              }`}
            >
              {message.read ? '✓✓' : message.delivered ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
