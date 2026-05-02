import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import useSocket from '../hooks/useSocket';

const ChatDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  // Initialize socket connection
  useSocket();

  const handleConversationSelect = () => {
    // On mobile, hide sidebar when conversation is selected
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        className={!showSidebar ? 'hidden' : ''}
        onConversationSelect={handleConversationSelect}
      />
      <ChatWindow onBack={handleBack} />
    </div>
  );
};

export default ChatDashboard;
