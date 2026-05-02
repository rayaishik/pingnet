const { getRedisClient } = require('../config/redis');

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 86400; // 24 hours

const saveSession = async (userId, sessionData) => {
  const redis = getRedisClient();
  const key = `${SESSION_PREFIX}${userId}`;
  await redis.setex(key, SESSION_TTL, JSON.stringify(sessionData));
};

const getSession = async (userId) => {
  const redis = getRedisClient();
  const key = `${SESSION_PREFIX}${userId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const deleteSession = async (userId) => {
  const redis = getRedisClient();
  const key = `${SESSION_PREFIX}${userId}`;
  await redis.del(key);
};

module.exports = { saveSession, getSession, deleteSession };
