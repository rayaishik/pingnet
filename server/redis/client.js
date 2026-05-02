const { getRedisClient } = require('../config/redis');

const redis = getRedisClient();

module.exports = redis;
