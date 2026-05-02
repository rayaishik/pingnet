import React from 'react';

const OnlineStatus = ({ isOnline, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { width: 8, height: 8 },
    md: { width: 10, height: 10 },
    lg: { width: 14, height: 14 },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`online-dot ${isOnline ? 'online' : 'offline'} ${className}`}
      style={{ ...s }}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
};

export default OnlineStatus;
