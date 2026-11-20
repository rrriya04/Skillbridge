const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token helper
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'skillbridge_default_jwt_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, department, year } = req.body;

    // Validation
    if (!name || !email || !password || !college || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, college, department, year).',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college,
      department,
      year,
      skills: [],
      interests: [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to SkillBridge.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        github: user.github,
        linkedin: user.linkedin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login student
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        github: user.github,
        linkedin: user.linkedin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
