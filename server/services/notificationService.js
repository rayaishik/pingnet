const { getRedisClient } = require('../config/redis');

const NOTIFICATION_QUEUE_PREFIX = 'notifications:';

const pushNotification = async (userId, notification) => {
  const redis = getRedisClient();
  const key = `${NOTIFICATION_QUEUE_PREFIX}${userId}`;
  await redis.lpush(key, JSON.stringify({
    ...notification,
    timestamp: new Date().toISOString(),
  }));
  // Keep only last 100 notifications
  await redis.ltrim(key, 0, 99);
};

const getNotifications = async (userId, count = 20) => {
  const redis = getRedisClient();
  const key = `${NOTIFICATION_QUEUE_PREFIX}${userId}`;
  const notifications = await redis.lrange(key, 0, count - 1);
  return notifications.map((n) => JSON.parse(n));
};

const clearNotifications = async (userId) => {
  const redis = getRedisClient();
  const key = `${NOTIFICATION_QUEUE_PREFIX}${userId}`;
  await redis.del(key);
};

module.exports = { pushNotification, getNotifications, clearNotifications };
