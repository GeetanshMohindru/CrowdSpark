import React from 'react';

export function Toast({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
} 