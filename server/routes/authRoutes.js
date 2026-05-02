const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

const registerSchema = {
  username: { required: true, minLength: 3, maxLength: 30 },
  email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
  password: { required: true, minLength: 6 },
};

const loginSchema = {
  email: { required: true },
  password: { required: true },
};

router.post(
  '/register',
  rateLimiter({ windowMs: 60000, max: 5, keyPrefix: 'rl:register' }),
  validate(registerSchema),
  register
);

router.post(
  '/login',
  rateLimiter({ windowMs: 60000, max: 10, keyPrefix: 'rl:login' }),
  validate(loginSchema),
  login
);

router.get('/me', protect, getMe);

module.exports = router;
