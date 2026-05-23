import Redis from 'ioredis';

// Initialize Redis client with connection URL from environment
export const redis = new Redis(process.env.REDIS_URL!);

// Event listeners for connection status
redis.on('connect', () => {
  console.log('Redis Connected');
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

/**
 * Async initializer for Redis. Ensures the client attempts to connect and resolves when ready.
 */
export async function initRedis(): Promise<void> {
  // ioredis connects automatically; we can await the 'ready' event for certainty.
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
