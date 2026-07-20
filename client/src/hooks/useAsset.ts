import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";

export const getCategory = async () => {
  return await apiClient.get("/assets");
};
export const useGetCategory = () => {
  return useQuery({
    queryKey: ["getCategory"],
    queryFn: getCategory,
  });
};

export const addAsset = async (data: any) => {
  return await apiClient.post("/add", data);
};
export const useAddAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAsset"] });
    },
  });
};

export const getAsset = async () => {
  return await apiClient.get("/get");
};
export const useGetAsset = () => {
  return useQuery({
    queryKey: ["getAsset"],
    queryFn: getAsset,
  });
};
