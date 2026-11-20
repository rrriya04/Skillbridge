import React from 'react';

const StatCard = ({ title, count, icon: Icon, description, color = 'blue' }) => {
  const getGradient = () => {
    switch (color) {
      case 'purple':
        return 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
      case 'green':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'amber':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
  };

  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '14px',
        background: getGradient(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        boxShadow: '0 8px 16px -4px rgba(0,0,0,0.12)',
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} />}
      </div>

      <div>
        <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
          {count}
        </h3>
        {description && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
