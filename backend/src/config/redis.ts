import Redis from 'ioredis';

// Lazy initialization of Redis after environment variables are loaded
let redisInstance: Redis | null = null;

export let redis: Redis;

export async function initRedis(): Promise<void> {
  if (redisInstance) return; // already initialized
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL not defined in environment');
  }
  redisInstance = new Redis(url);
  // expose as named export for other modules
  redis = redisInstance;
  redisInstance.on('connect', () => {
    console.log('Redis Connected');
  });
  redisInstance.on('error', (err) => {
    console.error('Redis Error:', err);
  });
  // wait for ready event to ensure connection
  await new Promise<void>((resolve, reject) => {
    redis.once('ready', () => {
      console.log('Redis Ready');
      resolve();
    });
    redis.once('error', (err) => {
      console.error('Redis initialization error:', err);
      reject(err);
    });
  });
}
