const User = require('../models/User');

/**
 * @desc    Get student profile by ID
 * @route   GET /api/users/:id
 * @access  Public or Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current logged-in student profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Fields that can be updated
    const { name, college, department, year, bio, skills, interests, github, linkedin, avatar } = req.body;

    if (name) user.name = name;
    if (college) user.college = college;
    if (department) user.department = department;
    if (year) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(',').map((i) => i.trim());
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        department: updatedUser.department,
        year: updatedUser.year,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search students by name, skills, or college
 * @route   GET /api/users/search
 * @access  Public
 */
const searchUsers = async (req, res, next) => {
  try {
    const { q, skill } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { college: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const users = await User.find(query).select('-password').limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateProfile,
  searchUsers,
};
