const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc    Get all users (except current user)
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select('username email avatar onlineStatus lastSeen')
    .sort({ username: 1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Search users by username
// @route   GET /api/users/search?q=
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    username: { $regex: q, $options: 'i' },
  })
    .select('username email avatar onlineStatus lastSeen')
    .limit(20)
    .sort({ username: 1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

module.exports = { getUsers, searchUsers };
