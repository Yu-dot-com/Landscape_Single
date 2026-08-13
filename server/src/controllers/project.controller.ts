import { Request, Response } from "express";
import * as projectServices from "../service/project.service";
import { thumbnailQueue } from "../queues/thumbnails.queue";
import { activityQueue } from "../queues/activity.queue";

export const createProject = async (req: Request, res: Response) => {
  try {
    const owner_id = req.user?.id as string;
    const { name, description } = req.body;

    const create = await projectServices.createProject(
      owner_id,
      name,
      description,
    );
    await activityQueue.add("log-activity", {
      actorId: owner_id,
      action: "PROJECT_CREATED",
      projectId: create.project.id,
      metadata: {
        projectName: create.project.name,
      },
    });
    return res.status(201).json(create);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Unknown error",
      });
    }
  }
};

export const updateProjectThumbnail = async (
  request: Request,
  res: Response,
) => {
  const { projectId } = request.params;
  const { thumbnail } = request.body;
  const userId = request.user?.id;
  if (!thumbnail) {
    return res.status(400).json({ message: "Thumbnail is required" });
  }

  await thumbnailQueue.add("generate-thumbnail", {
    projectId,
    thumbnailBase64: thumbnail,
    userId,
  });

  return res.status(202).json({
    message: "Thumbnail job queued successfully",
  });
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectServices.getUserProjects(req.user!.id);
    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOwnedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectServices.getOwnedProjects(req.user!.id);
    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSharedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectServices.getSharedProjects(req.user!.id);
    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id as string;
    const project_id = req.params.projectId as string;
    const project = await projectServices.getProjectNameById(project_id);
    const result = await projectServices.deleteProject(project_id, user_id);

    await activityQueue.add("log-activity", {
      actorId: user_id,
      action: "PROJECT_DELETED",
      projectId: project_id,
      metadata: {
        projectName: project.name,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      errror: "Internal server error",
    });
  }
};

export const updateProjectName = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const { name } = req.body;
    const user_id = req.user?.id as string;
    const project = await projectServices.getProjectNameById(project_id);

    const result = await projectServices.updateProjectName(
      project_id,
      name,
      user_id,
    );
    await activityQueue.add("log-activity", {
      actorId: user_id,
      action: "PROJECT_RENAMED",
      projectId: project_id,
      metadata: {
        newProjectName: result.name,
        oldProjectName: project.name,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      errror: "INternal server error",
    });
  }
};

export const getProjectCount = async (request: Request, response: Response) => {
  try {
    const id = request.user?.id as string;
    const result = await projectServices.getProjectCount(id);
    return response.status(200).json({ result });
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({
        message: error.message,
      });
    } else {
      response.status(400).json({
        message: "An unexpected error occurred",
      });
    }
  }
};

export const getProjectItems = async (request: Request, response: Response) => {
  try {
    const projectId = request.params.projectId as string;
    const result = await projectServices.getProjectItems(projectId);
    return response.status(200).json({ result });
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({
        message: error.message,
      });
    } else {
      response.status(400).json({
        message: "An unexpected error occurred",
      });
    }
  }
};
