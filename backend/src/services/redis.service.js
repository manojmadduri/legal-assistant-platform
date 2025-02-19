const redisClient = require('../config/redis');

class RedisService {
  static async set(key, value, expireTime = 3600) {
    try {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      await redisClient.set(key, value, 'EX', expireTime);
      return true;
    } catch (error) {
      console.error('Redis Set Error:', error);
      return false;
    }
  }

  static async get(key) {
    try {
      const value = await redisClient.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Redis Get Error:', error);
      return null;
    }
  }

  static async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis Delete Error:', error);
      return false;
    }
  }

  static async exists(key) {
    try {
      return await redisClient.exists(key);
    } catch (error) {
      console.error('Redis Exists Error:', error);
      return false;
    }
  }
}

module.exports = RedisService;