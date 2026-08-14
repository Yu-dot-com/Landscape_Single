import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import type { createProjectType, projectType } from "../types/projectTypes";

export const createProject = async (
  data: createProjectType,
): Promise<createProjectType[]> => {
  return await apiClient.post("project/create", data);
};
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["own_projects"] }),
        queryClient.invalidateQueries({ queryKey: ["project_count"] }),
      ]);
    },
  });
};

export const getOwnedProjects = async (): Promise<projectType[]> => {
  return (await apiClient.get("/project/getOwned")) as projectType[];
};
export const useGetOwnedProjects = () => {
  return useQuery({
    queryKey: ["getOwnedProjects"],
    queryFn: getOwnedProjects,
  });
};

export const getSharedProjects = async (): Promise<projectType[]> => {
  return (await apiClient.get("/project/getShared")) as projectType[];
};
export const useGetSharedProjects = () => {
  return useQuery({
    queryKey: ["getSharedProjects"],
    queryFn: getSharedProjects,
  });
};

export const deleteProject = async (id: string) => {
  return await apiClient.delete(`/project/delete/${id}`);
};
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["own_projects"] }),
        queryClient.invalidateQueries({ queryKey: ["project_count"] }),
      ]);
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });
};

export const getRecentProjects = async (): Promise<projectType[]> => {
  return (await apiClient.get("/project/get")) as projectType[];
};

export const useGetRecentProjects = () => {
  return useQuery({
    queryKey: ["recent_projects"],
    queryFn: getRecentProjects,
  });
};

export const updateProjectName = async (id: string, name: string) => {
  console.log("update ID:", id);
  return await apiClient.patch(`/project/update/${id}`, { name });
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateProjectName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedProjects"] });
    },
    onError: (error) => {
      console.error("Failed to update project's name", error);
    },
  });
};

export const getProjectCount = async () => {
  return await apiClient.get(`project/count`);
};
export const useGetProjectCount = () => {
  return useQuery({
    queryKey: ["projectCount"],
    queryFn: getProjectCount,
  });
};

export const getProjectItems = async (projectId: string) => {
  return await apiClient.get(`project/canvas/${projectId}`);
};
export const useGetProjectItems = (projectId: string) => {
  return useQuery({
    queryKey: ["projectItem", projectId],
    queryFn: () => getProjectItems(projectId),
    enabled: !!projectId,
    retry: false,
  });
};

export const updateProjectThumbnail = async (
  projectId: string,
  thumbnail: string,
) => {
  return await apiClient.post(`/project/${projectId}/thumbnail`, {
    thumbnail,
  });
};
export const useUpdateProjectThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      thumbnail,
    }: {
      projectId: string;
      thumbnail: string;
    }) => updateProjectThumbnail(projectId, thumbnail),

    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["own_projects"] }),
        queryClient.invalidateQueries({ queryKey: ["shared_projects"] }),
      ]);
    },
  });
};
