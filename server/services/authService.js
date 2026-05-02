const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const error = new Error(
      existingUser.email === email
        ? 'Email already registered'
        : 'Username already taken'
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      onlineStatus: user.onlineStatus,
      lastSeen: user.lastSeen,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      onlineStatus: user.onlineStatus,
      lastSeen: user.lastSeen,
    },
    token,
  };
};

module.exports = { generateToken, registerUser, loginUser };
