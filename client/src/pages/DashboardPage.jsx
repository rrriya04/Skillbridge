import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, requestService } from '../services/api';
import { 
  FolderPlus, 
  Users, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Compass, 
  User, 
  GitPullRequest,
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import RequestCard from '../components/RequestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    createdCount: 0,
    joinedCount: 0,
    pendingRequestsCount: 0,
    acceptedCount: 0,
  });

  const [myProjects, setMyProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [
        myProjectsRes,
        joinedProjectsRes,
        receivedReqRes,
        sentReqRes,
      ] = await Promise.all([
        projectService.getMyProjects(),
        projectService.getJoinedProjects(),
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
      ]);

      const myProjs = myProjectsRes.data?.projects || [];
      const joinedProjs = joinedProjectsRes.data?.projects || [];
      const receivedReqs = receivedReqRes.data?.requests || [];
      const sentReqs = sentReqRes.data?.requests || [];

      setMyProjects(myProjs);
      setJoinedProjects(joinedProjs);
      setReceivedRequests(receivedReqs);
      setSentRequests(sentReqs);

      // Calculate real dynamic stats
      const pendingReceived = receivedReqs.filter((r) => r.status === 'Pending').length;
      const pendingSent = sentReqs.filter((r) => r.status === 'Pending').length;
      const acceptedSent = sentReqs.filter((r) => r.status === 'Accepted').length;
      const acceptedReceived = receivedReqs.filter((r) => r.status === 'Accepted').length;

      setStats({
        createdCount: myProjs.length,
        joinedCount: joinedProjs.length,
        pendingRequestsCount: pendingReceived + pendingSent,
        acceptedCount: acceptedSent + acceptedReceived,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcceptRequest = async (id) => {
    try {
      await requestService.acceptRequest(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not accept request.');
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await requestService.rejectRequest(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject request.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <LoadingSpinner text="Loading your student collaboration dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Welcome Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-blue">Student Hub</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {user?.college} • {user?.department}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Welcome back, <span className="gradient-text">{user?.name}</span>!
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.35rem' }}>
              Track your college projects, incoming teammate applications, and team milestones.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/create-project" className="btn btn-primary">
              <PlusCircle size={18} />
              Post New Project
            </Link>
            <Link to="/explore" className="btn btn-secondary">
              <Compass size={18} color="#2563eb" />
              Explore Projects
            </Link>
          </div>
        </div>

        {/* 4 Dynamic Statistics Cards */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <StatCard
            title="Projects Created"
            count={stats.createdCount}
            icon={FolderPlus}
            description="Projects initiated by you"
            color="blue"
          />
          <StatCard
            title="Projects Joined"
            count={stats.joinedCount}
            icon={Users}
            description="Active teammate in projects"
            color="purple"
          />
          <StatCard
            title="Pending Requests"
            count={stats.pendingRequestsCount}
            icon={Clock}
            description="Incoming & outgoing reviews"
            color="amber"
          />
          <StatCard
            title="Collaborations"
            count={stats.acceptedCount}
            icon={CheckCircle2}
            description="Successfully connected"
            color="green"
          />
        </div>

        {/* Quick Action Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', alignSelf: 'center' }}>
            Quick Actions:
          </span>
          <Link to="/create-project" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} color="#2563eb" />
            Create Project
          </Link>
          <Link to="/explore" className="btn btn-secondary btn-sm">
            <Compass size={15} color="#2563eb" />
            Explore Projects
          </Link>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            <User size={15} color="#2563eb" />
            View My Profile
          </Link>
          <Link to="/requests" className="btn btn-secondary btn-sm">
            <GitPullRequest size={15} color="#2563eb" />
            Manage Requests ({stats.pendingRequestsCount})
          </Link>
        </div>

        {/* Two Column Layout: Projects & Collaboration Requests */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Your Created & Joined Projects */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Your College Projects
              </h2>
              <Link to="/my-projects" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>
                View All ({myProjects.length})
              </Link>
            </div>

            {myProjects.length === 0 && joinedProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                message="You haven't posted any projects or joined a team yet. Share your project idea or explore existing ones!"
                actionText="Post Project"
                actionLink="/create-project"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myProjects.slice(0, 2).map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}

                {joinedProjects.slice(0, 1).map((project) => (
                  <div key={project._id}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      TEAM MEMBER ON:
                    </p>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pending Collaboration Requests */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Incoming Team Requests
              </h2>
              <Link to="/requests" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>
                Manage All ({receivedRequests.length})
              </Link>
            </div>

            {receivedRequests.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No incoming requests"
                message="When other students apply to join your projects, their applications will show up here for you to accept or decline."
              />
            ) : (
              <div>
                {receivedRequests.slice(0, 2).map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="received"
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}

                {receivedRequests.length > 2 && (
                  <Link to="/requests" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    <span>See all {receivedRequests.length} requests</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            )}

            {/* Recent Sent Applications Preview */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  Your Outgoing Applications
                </h3>
                <Link to="/requests" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2563eb' }}>
                  View All ({sentRequests.length})
                </Link>
              </div>

              {sentRequests.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  You haven't requested to join any external projects yet.
                </p>
              ) : (
                sentRequests.slice(0, 1).map((req) => (
                  <RequestCard key={req._id} request={req} type="sent" />
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
