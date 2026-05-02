const { getRedisClient } = require('../config/redis');

const ONLINE_USERS_KEY = 'online_users';
const SOCKET_MAP_KEY = 'socket_map';

const setUserOnline = async (userId, socketId) => {
  const redis = getRedisClient();
  await redis.hset(ONLINE_USERS_KEY, userId, socketId);
  await redis.hset(SOCKET_MAP_KEY, socketId, userId);
};

const setUserOffline = async (userId, socketId) => {
  const redis = getRedisClient();
  await redis.hdel(ONLINE_USERS_KEY, userId);
  if (socketId) {
    await redis.hdel(SOCKET_MAP_KEY, socketId);
  }
};

const isUserOnline = async (userId) => {
  const redis = getRedisClient();
  const result = await redis.hexists(ONLINE_USERS_KEY, userId);
  return result === 1;
};

const getUserSocketId = async (userId) => {
  const redis = getRedisClient();
  return await redis.hget(ONLINE_USERS_KEY, userId);
};

const getOnlineUsers = async () => {
  const redis = getRedisClient();
  const users = await redis.hkeys(ONLINE_USERS_KEY);
  return users;
};

const getUserIdBySocketId = async (socketId) => {
  const redis = getRedisClient();
  return await redis.hget(SOCKET_MAP_KEY, socketId);
};

module.exports = {
  setUserOnline,
  setUserOffline,
  isUserOnline,
  getUserSocketId,
  getOnlineUsers,
  getUserIdBySocketId,
};
