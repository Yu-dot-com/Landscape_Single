import * as memberRepo from "../repositories/member.repo";
import * as authRepo from "../repositories/auth.repo";

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
  return await memberRepo.addMember(project_id, memberId, role);
};

export const getProjectMembers = async (project_id: string) => {
  const result = await memberRepo.getProjectMembers(project_id);
  return result;
};

export const deleteProjectMember = async (
  project_id: string,
  user_id: string,
) => {
  const result = await memberRepo.deleteProjectMember(project_id, user_id);
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
  return result;
};
