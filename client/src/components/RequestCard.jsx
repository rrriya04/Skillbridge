import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, User, Mail, GraduationCap, Github, Linkedin } from 'lucide-react';
import { formatDate, getInitials, getStatusBadgeClass } from '../utils/helpers';
import SkillTag from './SkillTag';

const RequestCard = ({
  request,
  type = 'received', // 'received' or 'sent'
  onAccept,
  onReject,
  actionLoading = false,
}) => {
  const { _id, projectId, senderId, receiverId, message, status, createdAt } = request;

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '0.85rem',
        marginBottom: '1rem'
      }}>
        {/* Project reference */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Project:
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            {projectId ? (
              <Link to={`/projects/${projectId._id}`} style={{ color: '#2563eb' }}>
                {projectId.title}
              </Link>
            ) : (
              <span style={{ color: '#94a3b8' }}>Deleted Project</span>
            )}
          </h4>
        </div>

        {/* Status Badge & Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {formatDate(createdAt)}
          </span>
        </div>
      </div>

      {/* Main Body */}
      {type === 'received' ? (
        // Incoming Request from a Student
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div className="avatar avatar-md" style={{ flexShrink: 0 }}>
              {getInitials(senderId?.name)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {senderId?.name}
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  ({senderId?.year} • {senderId?.department})
                </span>
              </div>
              
              <p style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <GraduationCap size={14} color="#2563eb" />
                {senderId?.college}
              </p>

              {/* Sender skills */}
              {senderId?.skills && senderId.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
                  {senderId.skills.map((skill, index) => (
                    <SkillTag key={index} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Requester's Custom Message */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderLeft: '4px solid #2563eb',
            padding: '0.85rem 1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.875rem',
            color: '#334155',
            lineHeight: '1.5',
            marginBottom: '1rem'
          }}>
            <p style={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              COLLABORATION PROPOSAL:
            </p>
            "{message}"
          </div>

          {/* Social Links if available */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
            {senderId?.github && (
              <a
                href={senderId.github}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569' }}
              >
                <Github size={14} /> GitHub Profile
              </a>
            )}
            {senderId?.linkedin && (
              <a
                href={senderId.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7' }}
              >
                <Linkedin size={14} /> LinkedIn Profile
              </a>
            )}
          </div>

          {/* Actions for Pending Requests */}
          {status === 'Pending' ? (
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <button
                className="btn btn-success btn-sm"
                onClick={() => onAccept(_id)}
                disabled={actionLoading}
                style={{ flex: 1 }}
              >
                <Check size={16} />
                Accept & Add to Team
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onReject(_id)}
                disabled={actionLoading}
                style={{ flex: 1 }}
              >
                <X size={16} />
                Decline
              </button>
            </div>
          ) : (
            <div style={{
              fontSize: '0.825rem',
              fontWeight: 600,
              color: status === 'Accepted' ? '#059669' : '#dc2626',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: status === 'Accepted' ? '#ecfdf5' : '#fef2f2',
              textAlign: 'center'
            }}>
              {status === 'Accepted' ? '✓ Student has been accepted and added to the project team.' : '✗ This request was declined.'}
            </div>
          )}
        </div>
      ) : (
        // Sent Request (Your application to someone else's project)
        <div>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
            <strong>Project Creator:</strong> {receiverId?.name} ({receiverId?.college || 'College Peer'})
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            fontSize: '0.875rem',
            color: '#475569',
            marginBottom: '0.75rem'
          }}>
            <p style={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
              YOUR MESSAGE:
            </p>
            "{message}"
          </div>

          {status === 'Accepted' && (
            <div className="alert alert-success" style={{ margin: 0, padding: '0.75rem' }}>
              🎉 Congratulations! Your request was accepted. You are now an official team member!
            </div>
          )}
          {status === 'Pending' && (
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ⏳ The project creator is reviewing your profile and skills.
            </p>
          )}
          {status === 'Rejected' && (
            <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>
              The project creator could not accept your request at this time.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;
