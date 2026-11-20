import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/api';
import { User, FolderPlus } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        setCreatedProjects(res.data?.projects || []);
      } catch (err) {
        console.error('Error fetching user projects:', err.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) {
      fetchUserProjects();
    }
  }, [user]);

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Profile Card */}
        <div style={{ marginBottom: '2.5rem' }}>
          <ProfileCard user={user} isCurrentUser={true} />
        </div>

        {/* Projects Posted by This Student */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FolderPlus size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Projects Initiated by You ({createdProjects.length})
            </h3>
          </div>

          {loadingProjects ? (
            <LoadingSpinner text="Loading your projects..." />
          ) : createdProjects.length > 0 ? (
            <div className="grid-2">
              {createdProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              You haven't posted any projects yet. Share your project idea to start collaborating!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
