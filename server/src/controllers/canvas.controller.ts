import * as canvasService from "../service/canvas.service";
import { Request, Response } from "express";

export const saveCanvas = async (
  request: Request<{ projectId: string }>,
  response: Response,
) => {
  try {
    const projectId = request.params.projectId;
    const { placedItems } = request.body;

    if (!projectId) {
      return response.status(400).json({
        message: "Project id not found",
      });
    }
    if (!placedItems) {
      return response.status(400).json({
        message: "data not found",
      });
    }
    if (!Array.isArray(placedItems)) {
      return response.status(400).json({
        message: "placedItems must be array",
      });
    }
    const result = await canvasService.saveCanvas(projectId, placedItems);
    console.log(result);
    return response.status(200).json({
      message: "Canvas saved successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Failed to save canvas",
    });
  }
};

export const getCanvas = async (request: Request, response: Response) => {
  try {
    const projectId = request.params.projectId as string;
    const result = await canvasService.getCanvas(projectId);
    return response.status(200).json( result );

  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Failed to save canvas",
    });
  }
};
