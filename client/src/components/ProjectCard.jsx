import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { getInitials, getCategoryBadgeClass, getStatusBadgeClass, formatDate } from '../utils/helpers';
import SkillTag from './SkillTag';

const ProjectCard = ({ project }) => {
  const {
    _id,
    title,
    description,
    category,
    requiredSkills,
    teamSize,
    members = [],
    collaborationType,
    status,
    createdBy,
    createdAt,
  } = project;

  const currentMembersCount = members.length;
  const isFull = currentMembersCount >= teamSize;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Top Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className={`badge ${getCategoryBadgeClass(category)}`}>
          {category}
        </span>
        <span className={`badge ${getStatusBadgeClass(status)}`}>
          {status}
        </span>
      </div>

      {/* Project Title */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.65rem', lineHeight: '1.4' }}>
        <Link to={`/projects/${_id}`} style={{ color: '#0f172a' }}>
          {title}
        </Link>
      </h3>

      {/* Short Description */}
      <p style={{
        fontSize: '0.875rem',
        color: '#64748b',
        lineHeight: '1.6',
        marginBottom: '1.25rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {description}
      </p>

      {/* Required Skills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {requiredSkills?.slice(0, 4).map((skill, index) => (
            <SkillTag key={index} skill={skill} />
          ))}
          {requiredSkills?.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center', paddingLeft: '0.25rem' }}>
              +{requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Team Size & Collaboration Type Bar */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        padding: '0.75rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
          <Users size={15} color={isFull ? '#ef4444' : '#2563eb'} />
          <span>
            {currentMembersCount} / {teamSize} Members
          </span>
          {isFull && (
            <span style={{ color: '#dc2626', fontSize: '0.72rem', fontWeight: 700 }}>
              (Full)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: collaborationType === 'Online' ? '#10b981' : collaborationType === 'Hybrid' ? '#8b5cf6' : '#f59e0b'
          }} />
          <span>{collaborationType}</span>
        </div>
      </div>

      {/* Footer: Creator & Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.85rem',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="avatar avatar-sm">
            {getInitials(createdBy?.name)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '110px' }}>
              {createdBy?.name || 'Creator'}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              {formatDate(createdAt)}
            </p>
          </div>
        </div>

        <Link to={`/projects/${_id}`} className="btn btn-outline btn-sm">
          <span>Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};

export default ProjectCard;
