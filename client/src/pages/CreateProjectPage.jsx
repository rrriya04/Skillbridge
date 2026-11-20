import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { PlusCircle, Sparkles, CheckCircle } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';
import ToastNotification from '../components/ToastNotification';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await projectService.createProject(formData);
      const newProjectId = res.data?.project?._id;
      navigate(`/projects/${newProjectId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project. Please verify inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            CAMPUS COLLABORATION
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
            Post a New Project Idea
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '600px', margin: '0.35rem auto 0 auto' }}>
            Share your project concept, specify the required teammates and skill sets, and start assembling your dream crew.
          </p>
        </div>

        {error && (
          <ToastNotification message={error} type="error" onClose={() => setError('')} />
        )}

        <div className="card" style={{ padding: '2.5rem' }}>
          <ProjectForm
            onSubmit={handleCreateProject}
            isSubmitting={isSubmitting}
            buttonText="Publish Project Idea"
          />
        </div>

      </div>
    </div>
  );
};

export default CreateProjectPage;
