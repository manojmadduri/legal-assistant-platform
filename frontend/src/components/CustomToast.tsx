import { toast } from 'react-hot-toast';
import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToastContent: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '300px' }}>
      <span style={{ marginRight: '24px' }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        ✕
      </button>
    </div>
  );
};

const CustomToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#68D391',
        color: '#fff',
        padding: '16px',
      },
    });
  },

  error: (message: string) => {
    toast((t) => (
      <ErrorToastContent 
        message={message} 
        onClose={() => toast.dismiss(t.id)} 
      />
    ), {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#F56565',
        color: '#fff',
        padding: '16px',
      },
    });
  },

  dismiss: toast.dismiss
};

export default CustomToast;
