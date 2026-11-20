import React from 'react';
import { Link } from 'react-router-dom';
import { FolderSearch, PlusCircle } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No items found',
  message = 'Try modifying your filters or search query to find what you are looking for.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="card" style={{
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '440px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        {message}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          {actionText}
        </Link>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
