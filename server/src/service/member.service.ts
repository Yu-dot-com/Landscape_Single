import * as memberRepo from "../repositories/member.repo";
import * as authRepo from "../repositories/auth.repo";
import redisClient from "../config/redis";

export const addMember = async (
  project_id: string,
  email: string,
  role: string,
) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new Error("user not found in member.service");
  }
  const memberId = user.id;

  const existing = await memberRepo.getMemberById(project_id, memberId);
  if (existing) {
    throw new Error("User already in this project");
  }
  await redisClient.del(`project:${project_id}:members`);
  return await memberRepo.addMember(project_id, memberId, role);
};
export const findMemberById=async(memberId:string)=>{
   const result=await authRepo.findUserByName(memberId);
   if(!result){
    throw new Error("member not find");
   }
   return result;
}
export const getProjectMembers = async (project_id: string) => {
  const cacheKey = `project:${project_id}:members`;

  const cachedMembers = await redisClient.get(cacheKey);

  if (cachedMembers) {
    console.log(`Redis HIT: ${cacheKey}`);
    return JSON.parse(cachedMembers);
  }
  console.log(`Redis MISS: ${cacheKey}`);
  const result = await memberRepo.getProjectMembers(project_id);
  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 300,
  });
  return result;
};

export const deleteProjectMember = async (
  project_id: string,
  user_id: string,
) => {
  const result = await memberRepo.deleteProjectMember(project_id, user_id);
  await redisClient.del(`project:${project_id}:members`);
  return result;
};

export const updateMemberRole = async (
  project_id: string,
  user_id: string,
  role: string,
) => {
  const existing = await memberRepo.getMemberById(project_id, user_id);
  if (!existing) {
    throw new Error("Member not found");
  }
  const result = await memberRepo.updateMemberRole(project_id, user_id, role);
  await redisClient.del(`project:${project_id}:members`);
  return result;
};
