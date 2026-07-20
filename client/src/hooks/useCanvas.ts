import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";

export const saveCanvas = async (projectId: string, placedItems: any[]) => {
  return await apiClient.post(`/save/${projectId}`,  {placedItems} );
};
export const useSaveCanvas = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      placedItems,
    }: {
      projectId: string;
      placedItems: any[];
    }) => saveCanvas(projectId, placedItems),
    onSuccess: (data) => {
      console.log("Project saved", data);
    },
  });
};

export const getCanvas = async(projectId:string) => {
  return await apiClient.get(`/getCanvas/${projectId}` );
}
export const useGetCanvas = (projectId:string) => {
  return useQuery({
    queryKey: ["getCanvas",projectId],
    queryFn:()=> getCanvas(projectId)
  })
}