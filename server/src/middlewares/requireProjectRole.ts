import type { Request, Response, NextFunction } from "express";
import * as memberRepo from "../repositories/member.repo";

export const requireProjectRole = (allowedRoles: string[]) => {
  console.log(allowedRoles)
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const projectId = req.params.projectId as string;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!projectId) {
        return res.status(400).json({ message: "Project ID missing" });
      }

      const member = await memberRepo.getProjectRole(projectId, userId);

      if (!member) {
        return res.status(404).json({ message: "Project not found" });
      }

      const isOwner = member.owner_id === userId;

      if (isOwner) {
        return next();
      }

      if (!member.role) {
        return res.status(403).json({ message: "Not a project member" });
      }

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({ message: "You are not authorized for this action!" });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};
