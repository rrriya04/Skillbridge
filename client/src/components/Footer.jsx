import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, ExternalLink, Code2, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}>
                <Users size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                Skill<span style={{ color: '#2563eb' }}>Bridge</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              The student skill & project collaboration platform. Bridging individual skills to form unstoppable college hackathon and capstone teams.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">
                <Code2 size={12} /> MERN Stack
              </span>
              <span className="badge badge-purple">
                <ShieldCheck size={12} /> JWT Secured
              </span>
              <span className="badge badge-green">
                <Sparkles size={12} /> College Mini-Project
              </span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link to="/explore" style={{ fontSize: '0.875rem', color: '#64748b' }}>Explore Projects</Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ fontSize: '0.875rem', color: '#64748b' }}>Student Dashboard</Link>
              </li>
              <li>
                <Link to="/create-project" style={{ fontSize: '0.875rem', color: '#64748b' }}>Post a Project Idea</Link>
              </li>
              <li>
                <Link to="/requests" style={{ fontSize: '0.875rem', color: '#64748b' }}>Collaboration Requests</Link>
              </li>
              <li>
                <Link to="/profile" style={{ fontSize: '0.875rem', color: '#64748b' }}>Student Profile</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Project Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Featured Domains
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link to="/explore?category=Web+Development" style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/explore?category=AI+%2F+Machine+Learning" style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/explore?category=App+Development" style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link to="/explore?category=IoT" style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  IoT & Embedded Systems
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Cybersecurity" style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Cybersecurity & Networks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Viva / Demo Highlight */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              College Mini-Project
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.825rem',
              color: '#475569',
              lineHeight: '1.5'
            }}>
              <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                🎓 Academic Submission
              </p>
              Designed and developed as an individual college mini-project solving teammate discovery in higher education.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Student Developers
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
