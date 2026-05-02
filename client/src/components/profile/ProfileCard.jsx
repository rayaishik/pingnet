import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import { generateAvatar } from '../../utils/helpers';

const ProfileCard = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-avatar-section">
        <img
          className="profile-avatar"
          src={user.avatar || generateAvatar(user.username)}
          alt={user.username}
        />
        <h2 className="profile-name">{user.username}</h2>
        <p className="profile-email">{user.email}</p>
        <span className={`profile-status-badge ${user.onlineStatus ? 'online' : 'offline'}`}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: user.onlineStatus ? 'var(--online)' : 'var(--offline)', display: 'inline-block' }} />
          {user.onlineStatus ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="profile-details">
        <div className="profile-detail-row">
          <span className="profile-detail-label">Username</span>
          <span className="profile-detail-value">{user.username}</span>
        </div>
        <div className="profile-detail-row">
          <span className="profile-detail-label">Email</span>
          <span className="profile-detail-value">{user.email}</span>
        </div>
        <div className="profile-detail-row">
          <span className="profile-detail-label">Member Since</span>
          <span className="profile-detail-value">
            {new Date(user.createdAt).toLocaleDateString([], {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        </div>
        <div className="profile-detail-row">
          <span className="profile-detail-label">Last Seen</span>
          <span className="profile-detail-value">
            {user.lastSeen
              ? new Date(user.lastSeen).toLocaleString()
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
