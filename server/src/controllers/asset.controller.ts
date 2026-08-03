import * as assetServics from "../service/asset.service";
import { Request, Response } from "express";

export const getCategory = async (request: Request, response: Response) => {
  try {
    const result = await assetServics.getCategory();
    return response.status(200).json(result);
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

export const addAsset = async(request:Request,response:Response) => {
  try {
    const data = request.body;
    const result = await assetServics.addAsset(data);
    return response.status(201).json(result);

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

}

export const getAsset = async(request:Request,response:Response) => {
  try{
    const result = await assetServics.getAsset()
    return response.status(201).json(result);
  }catch (error) {
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
}
