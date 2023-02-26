// refresh token을 저장할 redis 세팅
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_PORT);

module.exports = redisClient