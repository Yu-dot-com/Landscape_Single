import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://172.20.21.109:6379";

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, 
});