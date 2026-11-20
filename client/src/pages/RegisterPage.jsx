import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, User, GraduationCap, Building, Eye, EyeOff, ArrowRight } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '3rd Year',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'College email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.college.trim()) {
      errs.college = 'College or University name is required.';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department or branch is required.';
    }

    if (!formData.year) {
      errs.year = 'Please select your current year of study.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      college: formData.college.trim(),
      department: formData.department.trim(),
      year: formData.year,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
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
              Create Student Account
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem' }}>
              Join SkillBridge to connect with teammates and collaborate on projects.
            </p>
          </div>

          {serverError && (
            <ToastNotification message={serverError} type="error" onClose={() => setServerError('')} />
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* College Email */}
            <div className="form-group">
              <label className="form-label">
                College / University Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="e.g. student@college.edu"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* College & Department */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  College Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="college"
                  className={`form-control ${errors.college ? 'error' : ''}`}
                  placeholder="e.g. National Institute of Tech"
                  value={formData.college}
                  onChange={handleChange}
                />
                {errors.college && <span className="form-error">{errors.college}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Department / Branch <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  className={`form-control ${errors.department ? 'error' : ''}`}
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>
            </div>

            {/* Year of Study */}
            <div className="form-group">
              <label className="form-label">
                Year of Study <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="year"
                className={`form-control ${errors.year ? 'error' : ''}`}
                value={formData.year}
                onChange={handleChange}
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              {errors.year && <span className="form-error">{errors.year}</span>}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-control ${errors.password ? 'error' : ''}`}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="form-group">
                <label className="form-label">
                  Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Creating Student Account...' : 'Register as Student'}
            </button>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: '#2563eb' }}>
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
