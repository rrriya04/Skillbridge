import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Github, Linkedin, Edit3, Award } from 'lucide-react';
import { getInitials } from '../utils/helpers';
import SkillTag from './SkillTag';

const ProfileCard = ({ user, isCurrentUser = false }) => {
  if (!user) return null;

  const {
    name,
    email,
    college,
    department,
    year,
    bio,
    skills = [],
    interests = [],
    github,
    linkedin,
  } = user;

  return (
    <div className="card" style={{ padding: '2rem' }}>
      
      {/* Top Banner / Avatar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="avatar avatar-xl" style={{ boxShadow: '0 6px 16px rgba(37,99,235,0.2)' }}>
            {getInitials(name)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              {name}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={16} color="#2563eb" />
              {year} • {department}
            </p>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              {college}
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <Link to="/edit-profile" className="btn btn-outline btn-sm">
            <Edit3 size={15} />
            Edit Profile
          </Link>
        )}
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          About Me
        </h4>
        <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
          {bio || 'No bio provided yet.'}
        </p>
      </div>

      {/* Skills Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={16} color="#2563eb" />
          Technical & Soft Skills
        </h4>
        {skills && skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
            No skills listed yet. Add skills to get discovered for projects!
          </p>
        )}
      </div>

      {/* Interests Section */}
      {interests && interests.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
            Areas of Interest
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {interests.map((interest, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f5f3ff',
                  color: '#6d28d9',
                  border: '1px solid #ede9fe',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px'
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Social Links */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
          <Mail size={16} color="#64748b" />
          <span>{email}</span>
        </div>

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#1e293b' }}
          >
            <Github size={16} />
            <span>GitHub Profile</span>
          </a>
        )}

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#0284c7' }}
          >
            <Linkedin size={16} />
            <span>LinkedIn Profile</span>
          </a>
        )}
      </div>

    </div>
  );
};

export default ProfileCard;
