import { Request, Response } from "express";
import * as memberService from "../service/member.service";

export const addMember = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const { email, role } = req.body;

    const result = await memberService.addMember(project_id, email, role);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const result = await memberService.getProjectMembers(project_id);
        console.log("controller",result)

    return res.status(200).json(result);
  } catch (error) {
        if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteProjectMember = async (req: Request, res: Response) => {
  try {
    const project_id = req.params.projectId as string;
    const {userId} = req.body;

    const result = await memberService.deleteProjectMember(project_id, userId);

    return res.status(200).json(result);
  } catch (error) {
        if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
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
      error: "Internal server error",
    });
  }
};
