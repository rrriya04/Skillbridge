import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'AI / Machine Learning',
  'App Development',
  'Cybersecurity',
  'IoT',
  'Data Science',
  'Design',
  'Other',
];

const COLLABORATION_TYPES = ['All', 'Online', 'Offline', 'Hybrid'];

const STATUSES = ['All', 'Looking for Team Members', 'In Progress', 'Team Complete'];

const ProjectFilters = ({
  category,
  setCategory,
  collaborationType,
  setCollaborationType,
  status,
  setStatus,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
          <Filter size={18} color="#2563eb" />
          <span>Filters & Sorting</span>
        </div>
        
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
        >
          <RotateCcw size={13} />
          Reset All
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {/* Category Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Domain Category
          </label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ fontSize: '0.875rem', height: '40px' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Collaboration Type Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Collaboration Mode
          </label>
          <select
            className="form-control"
            value={collaborationType}
            onChange={(e) => setCollaborationType(e.target.value)}
            style={{ fontSize: '0.875rem', height: '40px' }}
          >
            {COLLABORATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Project Status
          </label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ fontSize: '0.875rem', height: '40px' }}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Sort By
          </label>
          <select
            className="form-control"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ fontSize: '0.875rem', height: '40px' }}
          >
            <option value="newest">Newest Projects First</option>
            <option value="oldest">Oldest Projects First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
