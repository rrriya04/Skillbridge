import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import SkillTag from './SkillTag';

const CATEGORIES = [
  'Web Development',
  'AI / Machine Learning',
  'App Development',
  'Cybersecurity',
  'IoT',
  'Data Science',
  'Design',
  'Other',
];

const COLLABORATION_TYPES = ['Online', 'Offline', 'Hybrid'];

const STATUSES = ['Looking for Team Members', 'In Progress', 'Team Complete'];

const ProjectForm = ({ initialData = {}, onSubmit, isSubmitting = false, buttonText = 'Save Project' }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || 'Web Development');
  const [skills, setSkills] = useState(initialData.requiredSkills || []);
  const [skillInput, setSkillInput] = useState('');
  const [teamSize, setTeamSize] = useState(initialData.teamSize || 4);
  const [duration, setDuration] = useState(initialData.duration || '1-3 months');
  const [collaborationType, setCollaborationType] = useState(initialData.collaborationType || 'Online');
  const [status, setStatus] = useState(initialData.status || 'Looking for Team Members');

  const [errors, setErrors] = useState({});

  // Add a skill tag
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: null }));
      }
    }
  };

  // Remove a skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Validate form before submitting
  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Project title is required.';
    } else if (title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters long.';
    }

    if (!description.trim()) {
      errs.description = 'Project description is required.';
    } else if (description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters long to clearly convey the project idea.';
    }

    if (!category) {
      errs.category = 'Please select a category.';
    }

    if (skills.length === 0) {
      errs.skills = 'Please add at least one required skill for the project.';
    }

    const parsedSize = parseInt(teamSize, 10);
    if (isNaN(parsedSize) || parsedSize < 2 || parsedSize > 20) {
      errs.teamSize = 'Team size must be between 2 and 20 members.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      requiredSkills: skills,
      teamSize: parseInt(teamSize, 10),
      duration: duration.trim(),
      collaborationType,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      
      {/* Title */}
      <div className="form-group">
        <label className="form-label">
          Project Title <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'error' : ''}`}
          placeholder="e.g. AI-Based Plant Disease Detection System"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">
          Project Description <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          rows={5}
          className={`form-control ${errors.description ? 'error' : ''}`}
          placeholder="Explain the problem statement, objectives, tech stack, and what you want to build together..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
        <span className="form-helper">Minimum 20 characters explaining the project vision.</span>
      </div>

      {/* Category & Collaboration Type */}
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Category Domain <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Collaboration Type <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            className="form-control"
            value={collaborationType}
            onChange={(e) => setCollaborationType(e.target.value)}
          >
            {COLLABORATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Skills Input */}
      <div className="form-group">
        <label className="form-label">
          Required Skills <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type a skill (e.g. React, Python, UI/UX, TensorFlow) and click Add"
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
        {errors.skills && <span className="form-error">{errors.skills}</span>}

        {/* Render Skill Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
          {skills.map((skill, index) => (
            <SkillTag key={index} skill={skill} onRemove={handleRemoveSkill} />
          ))}
        </div>
      </div>

      {/* Team Size, Duration, and Status */}
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">
            Target Team Size <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            min={2}
            max={20}
            className={`form-control ${errors.teamSize ? 'error' : ''}`}
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          />
          {errors.teamSize && <span className="form-error">{errors.teamSize}</span>}
          <span className="form-helper">Including yourself (e.g. 3 or 4)</span>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Duration</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 1-2 months, 4 weeks"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? 'Saving Project...' : buttonText}
        </button>
      </div>

    </form>
  );
};

export default ProjectForm;
