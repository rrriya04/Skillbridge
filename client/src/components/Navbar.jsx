import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { 
  Users, 
  PlusCircle, 
  Compass, 
  LayoutDashboard, 
  FolderKanban, 
  GitPullRequest, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
          }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Skill<span style={{ color: '#2563eb' }}>Bridge</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '600', color: '#64748b', marginTop: '-4px' }}>
              COLLABORATION PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link 
            to="/explore" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              color: isActive('/explore') ? '#2563eb' : '#475569',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: isActive('/explore') ? '#eff6ff' : 'transparent'
            }}
          >
            <Compass size={18} />
            Explore Projects
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontWeight: 600, 
                  fontSize: '0.92rem',
                  color: isActive('/dashboard') ? '#2563eb' : '#475569',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/dashboard') ? '#eff6ff' : 'transparent'
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link 
                to="/my-projects" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontWeight: 600, 
                  fontSize: '0.92rem',
                  color: isActive('/my-projects') ? '#2563eb' : '#475569',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/my-projects') ? '#eff6ff' : 'transparent'
                }}
              >
                <FolderKanban size={18} />
                My Projects
              </Link>

              <Link 
                to="/requests" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontWeight: 600, 
                  fontSize: '0.92rem',
                  color: isActive('/requests') ? '#2563eb' : '#475569',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/requests') ? '#eff6ff' : 'transparent'
                }}
              >
                <GitPullRequest size={18} />
                Requests
              </Link>
            </>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <>
              <Link to="/create-project" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                Post Project
              </Link>

              {/* Profile Dropdown Toggle */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '30px',
                    padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <div className="avatar avatar-sm">{getInitials(user?.name)}</div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {profileDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '210px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem',
                    zIndex: 100
                  }}>
                    <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.college}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.875rem',
                        color: '#334155',
                        borderRadius: '8px',
                        marginTop: '0.25rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} />
                      View Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.875rem',
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            color: '#1e293b',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#334155' }}
          >
            <Compass size={18} />
            Explore Projects
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#334155' }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/my-projects"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#334155' }}
              >
                <FolderKanban size={18} />
                My Projects
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#334155' }}
              >
                <GitPullRequest size={18} />
                Collaboration Requests
              </Link>
              <Link
                to="/create-project"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#2563eb' }}
              >
                <PlusCircle size={18} />
                Post Project
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', fontWeight: 600, color: '#334155' }}
              >
                <User size={18} />
                My Profile ({user?.name})
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Inline style for responsiveness */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
