import * as projectRepo from "../repositories/project.repo";
import { pool } from "../config/db";

export const createProject = async (
  owner_id: string,
  name: string,
  description: string,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    if (!name) {
      throw new Error("Project name is required");
    }
    const project = await projectRepo.createProject(
      client,
      owner_id,
      name,
      description,
    );
    if (!project) {
      throw new Error("cant create Projects");
    }

    const addMembers = await projectRepo.addMembers(
      client,
      project.id,
      owner_id,
      "admin",
    );
    if (!addMembers) {
      throw new Error("cant create ProjectMembers");
    }
    await client.query("COMMIT");
    return { project, addMembers };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getUserProjects = async (user_id: string) => {
  return await projectRepo.getUserProjects(user_id);
};

export const deleteProject = async (project_id: string, user_id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const deleteProject = await projectRepo.deleteProject(
      client,
      project_id,
      user_id,
    );
    await client.query("COMMIT");
    return deleteProject;
    return { message: "Project deleted successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updateProjectName = async (project_id: string, name: string) => {
  const result = await projectRepo.updateProjectName(project_id, name);

  if (!result) {
    throw new Error("Project not founnd");
  }
  return result;
};

export const getOwnedProjects = async (user_id: string) => {
  const result = await projectRepo.getOwnedProjects(user_id);
  return result;
};

export const getSharedProjects = async (user_id: string) => {
  const result = await projectRepo.getSharedProjects(user_id);
  return result;
};
export const getProjectCount = async (id: string) => {
  const result = await projectRepo.getProjectCount(id);
  return result;
};

export const getProjectItems = async(projectId:string) => {
  const result = await projectRepo.getProjectItems(projectId);
  return result
}