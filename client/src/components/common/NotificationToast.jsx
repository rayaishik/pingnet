import React from 'react';
import { Toaster } from 'react-hot-toast';

const NotificationToast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#22223a',
          color: '#e8e8f0',
          border: '1px solid #2a2a46',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#00b894',
            secondary: '#22223a',
          },
        },
        error: {
          iconTheme: {
            primary: '#e17055',
            secondary: '#22223a',
          },
        },
      }}
    />
  );
};

export default NotificationToast;
