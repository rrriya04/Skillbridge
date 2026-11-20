const CollaborationRequest = require('../models/CollaborationRequest');
const Project = require('../models/Project');

/**
 * @desc    Send a collaboration request to join a project
 * @route   POST /api/requests
 * @access  Private
 */
const sendRequest = async (req, res, next) => {
  try {
    const { projectId, message } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required.',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const userId = req.user._id;

    // 1. Cannot request to join own project
    if (project.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the creator of this project. You cannot request to join your own project.',
      });
    }

    // 2. Cannot request if already a team member
    const isAlreadyMember = project.members.some(
      (m) => m.user.toString() === userId.toString()
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project team.',
      });
    }

    // 3. Cannot request if team is full
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'This project team is already full. No further members can be accepted.',
      });
    }

    // 4. Cannot request if project status is not accepting members
    if (project.status === 'Team Complete') {
      return res.status(400).json({
        success: false,
        message: 'This project is marked as "Team Complete" and is no longer accepting new members.',
      });
    }

    // 5. Check for duplicate pending or accepted request
    const existingRequest = await CollaborationRequest.findOne({
      projectId,
      senderId: userId,
      status: { $in: ['Pending', 'Accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          existingRequest.status === 'Pending'
            ? 'You have already sent a pending collaboration request for this project.'
            : 'You have already been accepted into this project.',
      });
    }

    // Create the request
    const newRequest = await CollaborationRequest.create({
      projectId,
      senderId: userId,
      receiverId: project.createdBy,
      message: message || 'Hi! I would love to join your project team and contribute my skills.',
    });

    const populated = await CollaborationRequest.findById(newRequest._id)
      .populate('projectId', 'title category status teamSize members')
      .populate('receiverId', 'name email college');

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully!',
      request: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get collaboration requests sent by logged-in student
 * @route   GET /api/requests/sent
 * @access  Private
 */
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await CollaborationRequest.find({ senderId: req.user._id })
      .populate({
        path: 'projectId',
        select: 'title category status teamSize members createdBy',
        populate: {
          path: 'createdBy',
          select: 'name email college department',
        },
      })
      .populate('receiverId', 'name email college department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get collaboration requests received for projects owned by student
 * @route   GET /api/requests/received
 * @access  Private
 */
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await CollaborationRequest.find({ receiverId: req.user._id })
      .populate('projectId', 'title category status teamSize members')
      .populate('senderId', 'name email college department year skills bio github linkedin')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept a collaboration request
 * @route   PUT /api/requests/:id/accept
 * @access  Private (Receiver/Project Owner only)
 */
const acceptRequest = async (req, res, next) => {
  try {
    const request = await CollaborationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found.',
      });
    }

    // Only project owner (receiverId) can accept
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the project owner can accept this request.',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    const project = await Project.findById(request.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project associated with this request no longer exists.',
      });
    }

    // Check if team is already full
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: `Team size limit of ${project.teamSize} has already been reached.`,
      });
    }

    // Add sender to project members if not already there
    const alreadyMember = project.members.some(
      (m) => m.user.toString() === request.senderId.toString()
    );

    if (!alreadyMember) {
      project.members.push({
        user: request.senderId,
        role: 'Collaborator',
        joinedAt: new Date(),
      });
    }

    // Update project status if team size is now full
    if (project.members.length >= project.teamSize) {
      project.status = 'Team Complete';
    }

    await project.save();

    // Mark request as Accepted
    request.status = 'Accepted';
    await request.save();

    const populatedRequest = await CollaborationRequest.findById(request._id)
      .populate('projectId', 'title category status teamSize members')
      .populate('senderId', 'name email college department year skills bio github linkedin');

    res.status(200).json({
      success: true,
      message: 'Request accepted! Collaborator has been added to your project team.',
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a collaboration request
 * @route   PUT /api/requests/:id/reject
 * @access  Private (Receiver/Project Owner only)
 */
const rejectRequest = async (req, res, next) => {
  try {
    const request = await CollaborationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found.',
      });
    }

    // Only project owner can reject
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the project owner can reject this request.',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    request.status = 'Rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Collaboration request has been rejected.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
};
