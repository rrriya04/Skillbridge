import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, requestService } from '../services/api';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  GraduationCap, 
  Mail, 
  Github, 
  Linkedin, 
  Edit3, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { formatDate, getInitials, getCategoryBadgeClass, getStatusBadgeClass } from '../utils/helpers';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastNotification from '../components/ToastNotification';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Request to join modal & form
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinMessage, setJoinMessage] = useState('Hi! I would love to collaborate on your project and contribute my skills.');
  const [sendingRequest, setSendingRequest] = useState(false);

  // Check if current user already applied
  const [sentRequestStatus, setSentRequestStatus] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      const res = await projectService.getProjectById(id);
      setProject(res.data?.project);

      // Check if user has an existing request
      if (isAuthenticated) {
        try {
          const reqRes = await requestService.getSentRequests();
          const existing = reqRes.data?.requests?.find(
            (r) => r.projectId?._id === id || r.projectId === id
          );
          if (existing) {
            setSentRequestStatus(existing.status);
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Project not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, isAuthenticated]);

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(id);
        alert('Project deleted successfully.');
        navigate('/my-projects');
      } catch (err) {
        setToast({
          type: 'error',
          message: err.response?.data?.message || 'Could not delete project.',
        });
      }
    }
  };

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    setSendingRequest(true);
    try {
      await requestService.sendRequest({
        projectId: id,
        message: joinMessage.trim(),
      });
      setIsJoinModalOpen(false);
      setSentRequestStatus('Pending');
      setToast({
        type: 'success',
        message: 'Your collaboration request has been sent to the project owner!',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send collaboration request.',
      });
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <LoadingSpinner text="Fetching project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          {error || 'Project not found'}
        </div>
        <Link to="/explore" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Explore Projects
        </Link>
      </div>
    );
  }

  const isCreator = user && project.createdBy?._id === user._id;
  const isMember = user && project.members?.some((m) => m.user?._id === user._id || m.user === user._id);
  const isTeamFull = project.members?.length >= project.teamSize;
  const isTeamComplete = project.status === 'Team Complete';

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            Back to Explore Projects
          </Link>
        </div>

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Main Left Content */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              
              {/* Badges & Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span className={`badge ${getCategoryBadgeClass(project.category)}`}>
                  {project.category}
                </span>
                <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                  {project.status}
                </span>
                <span className="badge badge-gray">
                  Mode: {project.collaborationType}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
                  Posted {formatDate(project.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', lineHeight: '1.3' }}>
                {project.title}
              </h1>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Project Overview & Problem Statement
                </h3>
                <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {project.description}
                </p>
              </div>

              {/* Required Skills */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Required Skills & Technologies
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.requiredSkills?.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Specifications Strip */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Team Capacity
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {project.members?.length} / {project.teamSize} Members
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Collaboration Mode
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {project.collaborationType}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Target Duration
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {project.duration || '1-3 months'}
                  </p>
                </div>
              </div>

            </div>

            {/* Current Team Members Section */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                  Current Team Members ({project.members?.length} of {project.teamSize})
                </h3>
                {isTeamFull && (
                  <span className="badge badge-red">Team is Full</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.members?.map((member, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="avatar avatar-md">
                        {getInitials(member.user?.name)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                          {member.user?.name}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {member.user?.department} • {member.user?.college}
                        </p>
                      </div>
                    </div>

                    <span className="badge badge-purple">
                      {member.role || 'Collaborator'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Actions & Creator Details */}
          <div>
            
            {/* Action Box */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Collaboration Status
              </h3>

              {isCreator ? (
                <div>
                  <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                    You created this project. Manage your incoming requests from the Requests page.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link to="/my-projects" className="btn btn-secondary" style={{ width: '100%' }}>
                      <Edit3 size={16} />
                      Manage My Project
                    </Link>
                    <button
                      onClick={handleDeleteProject}
                      className="btn btn-danger"
                      style={{ width: '100%' }}
                    >
                      <Trash2 size={16} />
                      Delete Project
                    </button>
                  </div>
                </div>
              ) : isMember ? (
                <div className="alert alert-success" style={{ margin: 0 }}>
                  <CheckCircle2 size={18} />
                  <span>You are an active collaborator on this project team!</span>
                </div>
              ) : sentRequestStatus === 'Pending' ? (
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '10px',
                  color: '#b45309'
                }}>
                  <Clock size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Request Pending</h4>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    Your join request is being reviewed by {project.createdBy?.name}.
                  </p>
                </div>
              ) : sentRequestStatus === 'Accepted' ? (
                <div className="alert alert-success">
                  You are accepted into this project!
                </div>
              ) : isTeamFull || isTeamComplete ? (
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#64748b'
                }}>
                  <AlertCircle size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Applications Closed</h4>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    This project team has reached its target member limit ({project.teamSize} members).
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Do your skills match this project's requirements? Send a join proposal directly to the project lead.
                  </p>
                  {isAuthenticated ? (
                    <button
                      onClick={() => setIsJoinModalOpen(true)}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                    >
                      <UserPlus size={18} />
                      Request to Join Team
                    </button>
                  ) : (
                    <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      Log In to Join Project
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Creator Information Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PROJECT LEAD
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                <div className="avatar avatar-lg">
                  {getInitials(project.createdBy?.name)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {project.createdBy?.name}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                    {project.createdBy?.year} • {project.createdBy?.department}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {project.createdBy?.college}
                  </p>
                </div>
              </div>

              {project.createdBy?.bio && (
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "{project.createdBy.bio}"
                </p>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                  <Mail size={14} />
                  <span>{project.createdBy?.email}</span>
                </div>
                {project.createdBy?.github && (
                  <a href={project.createdBy.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b' }}>
                    <Github size={14} />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {project.createdBy?.linkedin && (
                  <a href={project.createdBy.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7' }}>
                    <Linkedin size={14} />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Request to Join Modal */}
      {isJoinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Request to Join Team
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Applying for: <strong>{project.title}</strong>
            </p>

            <form onSubmit={handleSendJoinRequest}>
              <div className="form-group">
                <label className="form-label">
                  Your Pitch & Relevant Skills <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Introduce yourself, mention which skills you bring to the table, and how you want to contribute..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  required
                />
                <span className="form-helper">
                  The project creator ({project.createdBy?.name}) will review your message and skills profile.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsJoinModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={sendingRequest || !joinMessage.trim()}
                >
                  {sendingRequest ? 'Submitting Request...' : 'Send Request to Join'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetailsPage;
