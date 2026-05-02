import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useSocketStore from '../../store/useSocketStore';
import useDebounce from '../../hooks/useDebounce';
import LoadingSkeleton from '../common/LoadingSkeleton';
import api from '../../services/api';
import { getOtherParticipant, formatTime, truncate, generateAvatar } from '../../utils/helpers';

const Sidebar = ({ className = '', onConversationSelect }) => {
  const { user, logout } = useAuthStore();
  const {
    conversations,
    activeConversation,
    loadingConversations,
    fetchConversations,
    setActiveConversation,
    createConversation,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const { data } = await api.get(`/users/search?q=${debouncedSearch}`);
        setSearchResults(data.data);
      } catch (err) {
        console.error('Search error:', err);
      }
      setSearching(false);
    };
    searchUsers();
  }, [debouncedSearch]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    onConversationSelect?.();
  };

  const handleSelectUser = async (selectedUser) => {
    // Create or get existing conversation
    const conversation = await createConversation(selectedUser._id);
    if (conversation) {
      setActiveConversation(conversation);
      setSearchQuery('');
      setSearchResults([]);
      onConversationSelect?.();
      fetchConversations();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${className}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h1 className="sidebar-title">PingNet</h1>
        <div className="sidebar-user-actions">
          <button
            className="sidebar-icon-btn"
            onClick={() => (window.location.hash = '#/profile')}
            title="Profile"
          >
            👤
          </button>
          <button
            className="sidebar-icon-btn"
            onClick={handleLogout}
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="search-results">
          <div className="search-results-title">
            {searching ? 'Searching...' : `Users (${searchResults.length})`}
          </div>
          {searchResults.map((u) => (
            <div
              key={u._id}
              className="search-user-item"
              onClick={() => handleSelectUser(u)}
            >
              <div className="avatar-wrapper">
                <img
                  className="avatar avatar-sm"
                  src={u.avatar || generateAvatar(u.username)}
                  alt={u.username}
                />
                <span
                  className={`online-dot ${
                    onlineUsers.includes(u._id) ? 'online' : 'offline'
                  }`}
                />
              </div>
              <div>
                <div className="conversation-name">{u.username}</div>
                <div className="conversation-last-msg">{u.email}</div>
              </div>
            </div>
          ))}
          {!searching && searchResults.length === 0 && debouncedSearch && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No users found
            </div>
          )}
        </div>
      )}

      {/* Conversation List */}
      {!searchQuery.trim() && (
        <div className="conversation-list">
          {loadingConversations ? (
            <LoadingSkeleton type="conversation" count={6} />
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">No conversations yet</div>
              <div className="empty-state-text">
                Search for users to start a new conversation
              </div>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv.participants, user._id);
              if (!other) return null;
              const isActive = activeConversation?._id === conv._id;
              const isUserOnline = onlineUsers.includes(other._id);

              return (
                <div
                  key={conv._id}
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    <div className="avatar-wrapper">
                      <img
                        className="avatar"
                        src={other.avatar || generateAvatar(other.username)}
                        alt={other.username}
                      />
                      <span
                        className={`online-dot ${isUserOnline ? 'online' : 'offline'}`}
                      />
                    </div>
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">{other.username}</div>
                    <div className="conversation-last-msg">
                      {conv.lastMessage
                        ? truncate(conv.lastMessage.content, 35)
                        : 'Start a conversation'}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    {conv.lastMessage && (
                      <span className="conversation-time">
                        {formatTime(conv.lastMessage.createdAt || conv.updatedAt)}
                      </span>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="conversation-unread">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
