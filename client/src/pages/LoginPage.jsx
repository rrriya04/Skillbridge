import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Target to redirect after login (e.g. /dashboard or referring page)
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message || 'Login failed. Please verify credentials.');
    }
  };

  // One-click demo credentials filler for college presentation/viva
  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrors({});
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        <div className="card" style={{ padding: '2.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem auto'
            }}>
              <Users size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Student Sign In
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem' }}>
              Welcome back to SkillBridge. Enter your credentials.
            </p>
          </div>

          {serverError && (
            <ToastNotification message={serverError} type="error" onClose={() => setServerError('')} />
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">College Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="e.g. aarav.sharma@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to SkillBridge'}
            </button>
          </form>

          {/* College Viva / Demo Helper Strip */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="#2563eb" />
              QUICK DEMO ACCOUNTS (Click to autofill):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoAccount('aarav.sharma@college.edu')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              >
                Aarav (Lead Dev)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoAccount('priya.patel@college.edu')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              >
                Priya (AI Researcher)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoAccount('rohan.verma@college.edu')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              >
                Rohan (IoT & Mobile)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoAccount('ananya.iyer@college.edu')}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              >
                Ananya (UI/UX)
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Default password: <code>password123</code>
            </p>
          </div>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            New to SkillBridge?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: '#2563eb' }}>
              Create an Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
