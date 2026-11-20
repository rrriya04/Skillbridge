import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search by project title, skills, description...' }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Search
        size={18}
        color="#94a3b8"
        style={{
          position: 'absolute',
          left: '1rem',
          pointerEvents: 'none'
        }}
      />
      
      <input
        type="text"
        className="form-control"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          fontSize: '0.95rem',
          height: '48px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(15,23,42,0.04)'
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '0.85rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
