import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/bullmq";
import { processThumbnail } from "../service/project.service";
import { connectRedis } from "../config/redis";

async function startWorker() {
  // Connect redis client for cache invalidation
  await connectRedis();

  const thumbnailWorker = new Worker(
    "thumbnailQueue",
    async (job: Job) => {
      const { projectId, thumbnailBase64, userId } = job.data;

      console.log(`Processing thumbnail for project: ${projectId}`);

      const result = await processThumbnail(
        projectId,
        thumbnailBase64,
        userId
      );

      return { success: true, thumbnail: result.thumbnail_url };
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  thumbnailWorker.on("completed", (job) => {
    console.log(`Thumbnail job ${job.id} completed`);
  });

  thumbnailWorker.on("failed", (job, err) => {
    console.error(`Thumbnail job ${job?.id} failed:, err`);
  });
}

startWorker().catch((err) => {
  console.error("Failed to start thumbnail worker:", err);
  process.exit(1);
});