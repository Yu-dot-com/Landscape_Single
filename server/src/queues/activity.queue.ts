import { Queue } from "bullmq";
import { redisConnection } from "../config/bullmq";

export const activityQueue = new Queue("activityQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});