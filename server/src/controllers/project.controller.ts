import { Request, Response } from "express";
import * as projectServices from "../service/project.service";

export const createProject = async (req: Request, res: Response) => {
  try {
    const owner_id = req.user?.id as string;
    const { name, description } = req.body;

    const create = await projectServices.createProject(
      owner_id,
      name,
      description,
    );

    return res.status(201).json(create);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: "Unknown error",
      });
    }
  }
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectServices.getUserProjects(req.user!.id);
    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
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
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
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
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id as string;
    const project_id = req.params.projectId as string;

    const result = await projectServices.deleteProject(project_id, user_id);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      errror: "INternal server error",
    });
  }
};

export const updateProjectName = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const {name} = req.body;

    const result = await projectServices.updateProjectName(project_id, name);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      errror: "INternal server error",
    });
  }
};

export const getProjectCount = async(request:Request,response:Response) => {
  try{
    const id = request.user?.id as string;
    const result = await projectServices.getProjectCount(id) 
    return response.status(200).json({result})
  }catch (error) {
    if (error instanceof Error) {
      response.status(400).json({
        error: error.message,
      });
    } else {
      response.status(400).json({
        error: "An unexpected error occurred",
      });
    }
  }
}

export const getProjectItems = async(request:Request,response:Response) => {
  try{
    const projectId = request.params.projectId as string;
    const result = await projectServices.getProjectItems(projectId) 
    return response.status(200).json({result})
  }catch (error) {
    if (error instanceof Error) {
      response.status(400).json({
        error: error.message,
      });
    } else {
      response.status(400).json({
        error: "An unexpected error occurred",
      });
    }
  }
}