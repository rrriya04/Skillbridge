const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      requiredSkills,
      teamSize,
      duration,
      collaborationType,
      status,
    } = req.body;

    // Validate skills
    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills.map((s) => s.trim()).filter(Boolean);
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (skillsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill for your project.',
      });
    }

    const parsedTeamSize = parseInt(teamSize, 10);
    if (isNaN(parsedTeamSize) || parsedTeamSize < 2) {
      return res.status(400).json({
        success: false,
        message: 'Total team size must be a number of at least 2.',
      });
    }

    // Automatically add creator as the Project Lead in members
    const newProject = new Project({
      title,
      description,
      category,
      requiredSkills: skillsArray,
      teamSize: parsedTeamSize,
      duration: duration || '1-3 months',
      collaborationType: collaborationType || 'Online',
      status: status || 'Looking for Team Members',
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Project Lead',
          joinedAt: new Date(),
        },
      ],
    });

    const savedProject = await newProject.save();

    const populatedProject = await Project.findById(savedProject._id)
      .populate('createdBy', 'name email college department')
      .populate('members.user', 'name email college department skills');

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects with search, filter, and sorting
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    const { search, category, skill, collaborationType, status, sort } = req.query;

    let filter = {};

    // Search by title, description, or skills
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { requiredSkills: { $in: [searchRegex] } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by required skill
    if (skill && skill !== 'All') {
      filter.requiredSkills = { $in: [new RegExp(`^${skill.trim()}$`, 'i')] };
    }

    // Filter by collaboration type
    if (collaborationType && collaborationType !== 'All') {
      filter.collaborationType = collaborationType;
    }

    // Filter by status
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email college department')
      .populate('members.user', 'name email college department skills')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project details by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email college department year bio github linkedin')
      .populate('members.user', 'name email college department year skills bio github linkedin');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner only)
 */
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit projects you created.',
      });
    }

    const {
      title,
      description,
      category,
      requiredSkills,
      teamSize,
      duration,
      collaborationType,
      status,
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (duration) project.duration = duration;
    if (collaborationType) project.collaborationType = collaborationType;
    if (status) project.status = status;

    if (teamSize) {
      const parsed = parseInt(teamSize, 10);
      if (parsed < project.members.length) {
        return res.status(400).json({
          success: false,
          message: `Team size cannot be smaller than current member count (${project.members.length}).`,
        });
      }
      project.teamSize = parsed;
    }

    if (requiredSkills) {
      let skillsArray = [];
      if (Array.isArray(requiredSkills)) {
        skillsArray = requiredSkills.map((s) => s.trim()).filter(Boolean);
      } else if (typeof requiredSkills === 'string') {
        skillsArray = requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (skillsArray.length > 0) {
        project.requiredSkills = skillsArray;
      }
    }

    const updated = await project.save();

    const populated = await Project.findById(updated._id)
      .populate('createdBy', 'name email college department')
      .populate('members.user', 'name email college department skills');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      project: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete projects you created.',
      });
    }

    // Delete associated requests
    await CollaborationRequest.deleteMany({ projectId: project._id });

    // Delete project
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get projects created by current logged-in user
 * @route   GET /api/projects/my-projects
 * @access  Private
 */
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate('members.user', 'name email college department skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get projects joined by current logged-in user
 * @route   GET /api/projects/joined
 * @access  Private
 */
const getJoinedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id,
      createdBy: { $ne: req.user._id }, // Not created by user
    })
      .populate('createdBy', 'name email college department')
      .populate('members.user', 'name email college department skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getJoinedProjects,
};
