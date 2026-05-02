import React from 'react';

const LoadingSkeleton = ({ type = 'conversation', count = 5 }) => {
  if (type === 'conversation') {
    return (
      <div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-avatar" />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'message') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              className="skeleton"
              style={{
                width: `${Math.random() * 30 + 20}%`,
                height: '40px',
                borderRadius: '16px',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
