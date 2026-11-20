import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Compass, 
  Lightbulb, 
  UserCheck, 
  Trophy,
  Code,
  Cpu,
  Layers,
  Shield,
  Palette,
  TrendingUp
} from 'lucide-react';
import { projectService } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'Machine Learning', 
  'TensorFlow', 'UI/UX Design', 'Flutter', 'MongoDB', 
  'Cybersecurity', 'IoT', 'Tailwind CSS', 'Docker'
];

const LandingPage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await projectService.getProjects();
        if (res.data?.projects) {
          // Take top 3 projects for featured section
          setFeaturedProjects(res.data.projects.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not fetch featured projects:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'var(--hero-gradient)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          
          {/* Badge Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e7ff',
            boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#4338ca'
          }}>
            <Sparkles size={16} color="#6366f1" />
            <span>The Premier Student Skill & Project Collaboration Network</span>
          </div>

          {/* Main Hero Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            maxWidth: '850px',
            margin: '0 auto 1.5rem auto'
          }}>
            Find Your Team.{' '}
            <span className="gradient-text">Build Something Great.</span>
          </h1>

          {/* Hero Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#475569',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Stop letting brilliant ideas stall for lack of a developer, ML engineer, or designer. 
            Connect with motivated college peers, showcase your technical skills, and build award-winning 
            projects together.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '3.5rem'
          }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              <Compass size={18} color="#2563eb" />
              <span>Explore Projects</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Find Complementary Skill Sets</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Real-Time Request Management</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>Verified College Students</span>
            </div>
          </div>

        </div>
      </section>

      {/* Platform Statistics Strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>500+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Students</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>150+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Projects Initiated</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>350+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Collaborations Formed</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>98%</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Team Completion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              STREAMLINED WORKFLOW
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
              How SkillBridge Works
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '580px', margin: '0.5rem auto 0 auto' }}>
              From idea inception to the final college symposium demo in three intuitive steps.
            </p>
          </div>

          <div className="grid-3">
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <UserCheck size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                Step 1
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem 0', color: '#0f172a' }}>
                Showcase Your Skills
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6' }}>
                Register with your college details, list your technical competencies, GitHub, and portfolio to let peers discover you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <Lightbulb size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                Step 2
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem 0', color: '#0f172a' }}>
                Post or Discover Ideas
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6' }}>
                Publish your own project vision specifying required teammates, or browse exciting projects posted by students.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <Trophy size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                Step 3
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem 0', color: '#0f172a' }}>
                Collaborate & Deliver
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6' }}>
                Send join requests, review incoming applications, confirm team members, and build impactful real-world software.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DISCOVER OPPORTUNITIES
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                Featured Student Projects
              </h2>
            </div>
            
            <Link to="/explore" className="btn btn-outline btn-sm">
              <span>View All Projects</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching featured student projects..." />
          ) : featuredProjects.length > 0 ? (
            <div className="grid-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No projects available at the moment.
            </div>
          )}

        </div>
      </section>

      {/* Popular Skills Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            In-Demand Skills on Campus
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Find projects that match your exact stack or find specialists who complement your strengths.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.65rem', maxWidth: '850px', margin: '0 auto' }}>
            {POPULAR_SKILLS.map((skill) => (
              <Link
                key={skill}
                to={`/explore?search=${encodeURIComponent(skill)}`}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                #{skill}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Ready to Collaborate CTA Banner */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Build Your Next Major Project?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Join students from top departments turning ambitious ideas into deployable applications and hackathon wins.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Create Student Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#334155' }}>
              <span>Browse All Ideas</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
