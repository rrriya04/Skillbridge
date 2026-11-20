import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import { 
  FolderKanban, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Users, 
  Clock, 
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { formatDate, getCategoryBadgeClass, getStatusBadgeClass } from '../utils/helpers';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ToastNotification from '../components/ToastNotification';

const MyProjectsPage = () => {
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'joined'
  const [toast, setToast] = useState(null);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const [createdRes, joinedRes] = await Promise.all([
        projectService.getMyProjects(),
        projectService.getJoinedProjects(),
      ]);
      setCreatedProjects(createdRes.data?.projects || []);
      setJoinedProjects(joinedRes.data?.projects || []);
    } catch (err) {
      console.error('Failed to load my projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated join requests will also be removed.')) {
      try {
        await projectService.deleteProject(id);
        setToast({ type: 'success', message: 'Project deleted successfully.' });
        fetchProjects();
      } catch (err) {
        setToast({
          type: 'error',
          message: err.response?.data?.message || 'Could not delete project.',
        });
      }
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingProject) return;
    setIsUpdating(true);
    try {
      await projectService.updateProject(editingProject._id, formData);
      setEditingProject(null);
      setToast({ type: 'success', message: 'Project details updated successfully!' });
      fetchProjects();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update project.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <LoadingSpinner text="Fetching your projects..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>
              <FolderKanban size={18} />
              <span>PROJECT MANAGEMENT</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              My Projects
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              Manage your created initiatives and monitor teams you have joined.
            </p>
          </div>

          <Link to="/create-project" className="btn btn-primary">
            <PlusCircle size={18} />
            Post New Project
          </Link>
        </div>

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('created')}
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'created' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'created' ? '3px solid #2563eb' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Created by Me ({createdProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'joined' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'joined' ? '3px solid #2563eb' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Joined as Teammate ({joinedProjects.length})
          </button>
        </div>

        {/* Tab 1: Created Projects */}
        {activeTab === 'created' && (
          <div>
            {createdProjects.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No created projects"
                message="You have not posted any project ideas yet. Create your first project to start recruiting teammates."
                actionText="Create Project"
                actionLink="/create-project"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {createdProjects.map((project) => (
                  <div key={project._id} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${getCategoryBadgeClass(project.category)}`}>
                          {project.category}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </span>
                        <span className="badge badge-gray">
                          {project.collaborationType}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="btn btn-secondary btn-sm"
                          title="Edit project"
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                      <Link to={`/projects/${project._id}`} style={{ color: '#0f172a' }}>
                        {project.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                      {project.description}
                    </p>

                    {/* Member Avatars & Progress */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      padding: '0.85rem 1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={18} color="#2563eb" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                          Team Roster: {project.members?.length} / {project.teamSize} Students
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to="/requests" className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                          Review Requests
                        </Link>
                        <Link to={`/projects/${project._id}`} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
                          View Live Page
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Joined Projects */}
        {activeTab === 'joined' && (
          <div>
            {joinedProjects.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No joined projects"
                message="You haven't joined any project teams yet. Explore projects and send a collaboration request!"
                actionText="Explore Projects"
                actionLink="/explore"
              />
            ) : (
              <div className="grid-3">
                {joinedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Edit Project: {editingProject.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <ProjectForm
              initialData={editingProject}
              onSubmit={handleUpdate}
              isSubmitting={isUpdating}
              buttonText="Save Changes"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProjectsPage;
