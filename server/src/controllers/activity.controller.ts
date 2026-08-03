import type { Request, Response } from "express";
import * as activityService from "../service/activity.service";

export const getRecentActivities = async (
  request: Request,
  response: Response,
) => {
  try {
    const userId = request.user?.id as string;

    const recent = await activityService.getRecentActivities(userId, 20);

    return response.status(200).json(recent);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(500).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const getProjectActivities = async (
  request: Request,
  response: Response,
) => {
  try {
    const projectId = request.params.projectId as string;

    const recent = await activityService.getProjectActivities(
      projectId,
      20,
    );

    return response.status(200).json(recent);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(500).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};