import React, { useEffect, useState } from 'react';
import { requestService } from '../services/api';
import { GitPullRequest, Inbox, Send, CheckCircle2, Clock } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ToastNotification from '../components/ToastNotification';

const CollaborationRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchRequests = async () => {
    try {
      const [recRes, sentRes] = await Promise.all([
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
      ]);
      setReceivedRequests(recRes.data?.requests || []);
      setSentRequests(sentRes.data?.requests || []);
    } catch (err) {
      console.error('Error fetching collaboration requests:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(true);
    try {
      const res = await requestService.acceptRequest(id);
      setToast({
        type: 'success',
        message: res.data?.message || 'Request accepted! Collaborator has been added to your project team.',
      });
      fetchRequests();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Could not accept request.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const res = await requestService.rejectRequest(id);
      setToast({
        type: 'info',
        message: res.data?.message || 'Collaboration request declined.',
      });
      fetchRequests();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Could not decline request.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <LoadingSpinner text="Loading collaboration requests..." />
      </div>
    );
  }

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>
            <GitPullRequest size={18} />
            <span>COLLABORATION SYSTEM</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            Collaboration Requests
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
            Review incoming teammate applications or track the status of your join proposals.
          </p>
        </div>

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('received')}
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'received' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'received' ? '3px solid #2563eb' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Inbox size={18} />
            Received Requests ({receivedRequests.length})
            {pendingReceivedCount > 0 && (
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                {pendingReceivedCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'sent' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'sent' ? '3px solid #2563eb' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Send size={18} />
            Sent Proposals ({sentRequests.length})
          </button>
        </div>

        {/* Tab 1: Received Requests */}
        {activeTab === 'received' && (
          <div>
            {receivedRequests.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No incoming requests"
                message="When other students apply to join your projects, their applications with their skills and messages will appear here."
              />
            ) : (
              <div>
                {receivedRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="received"
                    onAccept={handleAccept}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sent Proposals */}
        {activeTab === 'sent' && (
          <div>
            {sentRequests.length === 0 ? (
              <EmptyState
                icon={Send}
                title="No sent applications"
                message="You haven't requested to join any student projects yet. Find exciting projects on the explore page and send a proposal!"
                actionText="Explore Projects"
                actionLink="/explore"
              />
            ) : (
              <div>
                {sentRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    type="sent"
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CollaborationRequestsPage;
