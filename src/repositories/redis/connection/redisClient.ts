import { createClient } from 'redis';
import { configDotenv } from 'dotenv';

configDotenv();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10),
  },
});

redisClient.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Redis client connected 🚀');
});

redisClient.on('error', (err: Error) => {
  // eslint-disable-next-line no-console
  console.log(`Something went wrong with Redis. ${err} 💥`);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
