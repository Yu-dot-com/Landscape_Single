import * as canvasRepo from "../repositories/canvas.repo";

export const saveCanvas = async (projectId: string, placedItems: any[]) => {
  const result = await canvasRepo.saveCanvas(projectId, placedItems);

  return result;
};

export const getCanvas = async(projectId: string) => {
  const result = await canvasRepo.getCanvas(projectId)
  return result
}