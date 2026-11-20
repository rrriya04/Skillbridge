import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { User, Plus, X, ArrowLeft, Save } from 'lucide-react';
import SkillTag from '../components/SkillTag';
import ToastNotification from '../components/ToastNotification';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'];

const EditProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState(user?.interests || []);
  const [interestInput, setInterestInput] = useState('');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Skill tag add/remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Interest tag add/remove
  const handleAddInterest = (e) => {
    e.preventDefault();
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const res = await userService.updateProfile({
        name: name.trim(),
        college: college.trim(),
        department: department.trim(),
        year,
        bio: bio.trim(),
        skills,
        interests,
        github: github.trim(),
        linkedin: linkedin.trim(),
      });

      if (res.data?.user) {
        updateUserProfile(res.data.user);
      }
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            Back to Profile
          </Link>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Edit Student Profile
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
              Keep your technical skills, college branch, and social links up to date.
            </p>
          </div>

          {error && (
            <ToastNotification message={error} type="error" onClose={() => setError('')} />
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* College & Department */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  className="form-control"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Year of Study */}
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label">About Me / Bio</label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Share your technical interests, hackathon experiences, or what you love building..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Skills Tag Input */}
            <div className="form-group">
              <label className="form-label">Technical & Soft Skills</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React, Python, Machine Learning, UI/UX"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddSkill}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} onRemove={handleRemoveSkill} />
                ))}
              </div>
            </div>

            {/* Areas of Interest Input */}
            <div className="form-group">
              <label className="form-label">Areas of Interest</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Web Development, Hackathons, Computer Vision"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddInterest}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f5f3ff',
                      color: '#6d28d9',
                      border: '1px solid #ede9fe',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', padding: 0 }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://github.com/your-username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://linkedin.com/in/your-username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Link to="/profile" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default EditProfilePage;
