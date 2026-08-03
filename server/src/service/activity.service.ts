import * as activityRepo from "../repositories/activity.repo";

export const logActivity = async (
  actorId: string,
  action: string,
  projectId?: string | null,
  metadata: Record<string, any> = {}
) => {
  const activity = await activityRepo.createActivity(
    actorId,
    action,
    projectId,
    metadata
  );

  if (!activity) {
    throw new Error("Failed to create activity");
  }

  return activity;
};

export const getRecentActivities = async (userId: string, limit = 20) => {
  const activities = await activityRepo.getRecentActivities(userId, limit);
  return activities;
};

export const getProjectActivities = async (
  projectId: string,
  limit = 20
) => {
  const activities = await activityRepo.getProjectActivities(
    projectId,
    limit
  );
  return activities;
};