import React from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/profile/ProfileCard';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Link to="/" className="btn btn-ghost">
          ← Back to Chat
        </Link>
      </div>
      <ProfileCard />
    </div>
  );
};

export default ProfilePage;
