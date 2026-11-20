import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        backgroundColor: isSuccess ? '#ecfdf5' : isError ? '#fef2f2' : '#eff6ff',
        border: `1px solid ${isSuccess ? '#a7f3d0' : isError ? '#fecaca' : '#bfdbfe'}`,
        color: isSuccess ? '#065f46' : isError ? '#991b1b' : '#1e40af',
        fontSize: '0.875rem',
        fontWeight: 500,
        marginBottom: '1.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isSuccess && <CheckCircle2 size={18} color="#059669" />}
        {isError && <AlertCircle size={18} color="#dc2626" />}
        {!isSuccess && !isError && <Info size={18} color="#2563eb" />}
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ToastNotification;
