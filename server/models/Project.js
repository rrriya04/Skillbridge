const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    minlength: [20, 'Description must be at least 20 characters long to explain the project idea'],
  },
  category: {
    type: String,
    required: [true, 'Category must be selected'],
    enum: [
      'Web Development',
      'AI / Machine Learning',
      'App Development',
      'Cybersecurity',
      'IoT',
      'Data Science',
      'Design',
      'Other',
    ],
  },
  requiredSkills: {
    type: [String],
    required: [true, 'At least one required skill must be added'],
    validate: {
      validator: function (skills) {
        return skills && skills.length > 0;
      },
      message: 'Please specify at least one skill required for this project',
    },
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: [2, 'Team size must be at least 2'],
    max: [20, 'Team size cannot exceed 20'],
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        default: 'Collaborator',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  duration: {
    type: String,
    default: '1-3 months',
    trim: true,
  },
  collaborationType: {
    type: String,
    required: [true, 'Collaboration type is required'],
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online',
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['Looking for Team Members', 'Team Complete', 'In Progress'],
    default: 'Looking for Team Members',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
