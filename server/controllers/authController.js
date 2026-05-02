const asyncHandler = require('../middleware/asyncHandler');
const { registerUser, loginUser } = require('../services/authService');
const { generateAvatarUrl } = require('../utils/helpers');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const result = await registerUser({ username, email, password });

  // Set default avatar if not provided
  if (!result.user.avatar) {
    const avatar = generateAvatarUrl(username);
    await User.findByIdAndUpdate(result.user._id, { avatar });
    result.user.avatar = avatar;
  }

  res.status(201).json({
    success: true,
    data: result,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, getMe };
