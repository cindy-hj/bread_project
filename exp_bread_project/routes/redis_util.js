// // refresh token을 저장할 redis 세팅
// const redis = require('redis');
// const redisClient = redis.createClient({
//     host: 'redis-server',
//     port: 6379,
//     // legacyMode: true,
// }) // 나중에 환경변수로 설정할것
// // const redisClient = redis.createClient(process.env.REDIS_PORT);

// redisClient.on('connect', () => console.log('Connected to Redis!'));
// redisClient.on('error', (err) => console.log('Resid Client Error', err));
// redisClient.connect();

// module.exports = redisClient