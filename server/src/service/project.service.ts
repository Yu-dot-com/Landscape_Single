import * as projectRepo from "../repositories/project.repo";
import { pool } from "../config/db";
import redisClient from "../config/redis";
import cloudinary from "../config/cloudinary";



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
    await redisClient.del([`projects:user:${owner_id}:own`]);
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
    await redisClient.del([`projects:user:${user_id}:own`]);
    return deleteProject;
    
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
export const getProjectNameById=async(projectId:string)=>{
  const result=await projectRepo.getProjectNameById(projectId);
  if(!result){
    throw new Error("Project not found");
  }
  return result;
}
export const updateProjectName = async (project_id: string, name: string,user_id:string) => {
  const result = await projectRepo.updateProjectName(project_id, name);

  if (!result) {
    throw new Error("Project not founnd");
  }
  await redisClient.del([
      `projects:user:${user_id}:own`,
    ]);
  return result;
};

export const getOwnedProjects = async (user_id: string) => {
  const cacheKey = `projects:user:${user_id}:own`;

  const cachedProjects = await redisClient.get(cacheKey);

  if (cachedProjects) {
    console.log(`Redis HIT: ${cacheKey}`);
    return JSON.parse(cachedProjects);
  }
  console.log(`Redis MISS: ${cacheKey}`);
  const result = await projectRepo.getOwnedProjects(user_id);
  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 300,
  });
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

export const getProjectItems = async (projectId: string) => {
  const result = await projectRepo.getProjectItems(projectId);
  return result;
};

export const processThumbnail= async( projectId: string, thumbnailBase64: string, userId?: string) => {
  const uploadResult = await cloudinary.uploader.upload(thumbnailBase64, {
    folder: "landscape/thumbnails",
    public_id: `project_${projectId}`,
    overwrite: true,
    transformation: [{ width: 400, height: 300, crop: "fill" }],
  });

  const thumbnailUrl = uploadResult.secure_url;

  const result = await projectRepo.updateProjectThumbnail(
    projectId,
    thumbnailUrl
  );

  if (!result) {
    throw new Error("Project not found");
  }

  if (userId) {
    await redisClient.del([`projects:user:${userId}:own`]);
  }

  return result;
};