import { Request, Response } from "express";
import * as memberService from "../service/member.service";
import { activityQueue } from "../queues/activity.queue";
import { findUserByEmail } from "../repositories/auth.repo";
import { getProjectNameById } from "../service/project.service";
import redisClient from "../config/redis";

export const addMember = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const { email, role } = req.body;
    const userId = req.user?.id as string;
    const member = await findUserByEmail(email);
    const result = await memberService.addMember(project_id, email, role);
    const project=await getProjectNameById(project_id);
    await activityQueue.add("log-activity", {
      actorId: userId,
      action: "MEMBER_ADDED",
      projectId:project_id,
      metadata: {
        projectName: project.name,
        memberName: member.username,
      },
    });
    return res.status(201).json(result);
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

export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const result = await memberService.getProjectMembers(project_id);
    console.log("controller", result);

    return res.status(200).json(result);
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

export const deleteProjectMember = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const { memberId } = req.body;
    const userId = req.user?.id as string;
    const member=await memberService.findMemberById(memberId);
    const result = await memberService.deleteProjectMember(
      project_id,
      memberId,
    );
    const project=await getProjectNameById(project_id);
      await redisClient.publish(
  "project-events",
  JSON.stringify({
    type:"USER_REMOVED",
    projectId:project_id,
    userId:memberId,
  })
);
    await activityQueue.add("log-activity", {
      actorId: userId,
      action: "MEMBER_DELETED",
      projectId:project_id,
      metadata: {
        projectName: project.name,
        memberName: member.username,
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
      message: "Internal server error",
    });
  }
};

export const updateMemberRole = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.project_id as string;
    const { user_id, role } = req.body;

    const result = await memberService.updateMemberRole(
      project_id,
      user_id,
      role,
    );

    return res.status(200).json(result);
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
