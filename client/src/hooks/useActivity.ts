import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";


export const getRecentActivities = async (limit = 20) => {
  const response = await apiClient.get("/activity/recent", {
    params: { limit },
  });

  return response;
};

export const useRecentActivities = (limit = 20) => {
  return useQuery({
    queryKey: ["activities", "recent", limit],
    queryFn: () => getRecentActivities(limit),
  });
};

export const getProjectActivities = async (
  projectId: string,
  limit = 20
) => {
  const response = await apiClient.get(
    `/activity/project/${projectId}`,
    {
      params: { limit },
    }
  );

  return response;
};
export const useProjectActivities = (
  projectId: string,
  limit = 20
) => {
  return useQuery({
    queryKey: ["activities", projectId, limit],
    queryFn: () =>
    getProjectActivities(
        projectId,
        limit
      ),
    enabled: !!projectId,
  });
};