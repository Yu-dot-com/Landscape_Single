import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/bullmq";
import { logActivity } from "../service/activity.service";

async function startWorker() {
  const activityWorker = new Worker(
    "activityQueue",
    async (job: Job) => {
      const { actorId, action, projectId, metadata } = job.data;

      console.log(`Logging activity: ${action} by ${actorId}`);

      const result = await logActivity(
        actorId,
        action,
        projectId,
        metadata ?? {}
      );

      return { success: true, activityId: result.id };
    },
    {
      connection: redisConnection,
      concurrency: 10,
    }
  );

  activityWorker.on("completed", (job) => {
    console.log(`Activity job ${job.id} completed`);
  });

  activityWorker.on("failed", (job, err) => {
    console.error(`Activity job ${job?.id} failed:`, err);
  });
}

startWorker().catch((err) => {
  console.error("Failed to start activity worker:", err);
  process.exit(1);
});