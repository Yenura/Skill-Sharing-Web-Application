import React, { createContext, useContext, useState, useCallback } from 'react';
import 'boxicons/css/boxicons.min.css';

// Create the toast context
const ToastContext = createContext();

// Toast types and their respective colors and icons
const TOAST_TYPES = {
  success: {
    bgColor: 'bg-green-100 border-green-500 text-green-700',
    icon: 'bx bx-check-circle'
  },
  error: {
    bgColor: 'bg-red-100 border-red-500 text-red-700',
    icon: 'bx bx-error-circle'
  },
  warning: {
    bgColor: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    icon: 'bx bx-info-circle'
  },
  info: {
    bgColor: 'bg-blue-100 border-blue-500 text-blue-700',
    icon: 'bx bx-info-circle'
  }
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    
    // Add the toast to the list
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  // Function to remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-lg border-l-4 shadow-md animate-fadeIn ${TOAST_TYPES[toast.type].bgColor}`}
          >
            <div className="flex items-center">
              <i className={`${TOAST_TYPES[toast.type].icon} text-2xl mr-3`}></i>
              <span className="font-medium">{toast.message}</span>
              <button 
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <i className='bx bx-x text-xl'></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
