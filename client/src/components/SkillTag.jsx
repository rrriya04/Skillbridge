import React from 'react';

const SkillTag = ({ skill, onRemove, color = 'blue' }) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      backgroundColor: '#f1f5f9',
      color: '#334155',
      fontSize: '0.75rem',
      fontWeight: 600,
      padding: '0.2rem 0.6rem',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      transition: 'var(--transition)'
    }}>
      #{skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0',
            fontSize: '0.9rem',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
          }}
          aria-label={`Remove ${skill}`}
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default SkillTag;
