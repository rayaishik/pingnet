const { getRedisClient } = require('../config/redis');

const rateLimiter = (options = {}) => {
  const {
    windowMs = 60000,
    max = 100,
    message = 'Too many requests, please try again later',
    keyPrefix = 'rl',
  } = options;

  return async (req, res, next) => {
    try {
      const redis = getRedisClient();
      const key = `${keyPrefix}:${req.ip}`;
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));

      if (current > max) {
        return res.status(429).json({
          success: false,
          message,
        });
      }

      next();
    } catch (error) {
      // If Redis is down, allow the request through
      console.error('Rate limiter error:', error.message);
      next();
    }
  };
};

module.exports = rateLimiter;
