import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import type { addMemberFormValues } from "../schemas/memberSchema";
type AddMemberVariables = {
  projectId: string;
  data: addMemberFormValues;
};
export const addMember = async (projectId: string, data: any) => {
  return await apiClient.post(`projects/${projectId}/member/invite`, data);
};
export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addMember"],

    mutationFn: ({ projectId, data }: AddMemberVariables) => {
      return addMember(projectId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMembers"]["deleteMember"],
      });
    },
    onError: (error) => {
      console.error("Failed to add member", error);
    },
  });
};

export const getMembers = async (projectId: string) => {
  return await apiClient.get(`projects/${projectId}/member/get`);
};
export const useGetMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["getMembers"],
    queryFn: () => getMembers(projectId),
  });
};

export const deleteMember = async (projectId: string,memberId:string) => {
  return await apiClient.delete(`projects/${projectId}/member/delete`,{ data: { memberId } });
};
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMember"],
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => deleteMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMembers"]
      });
    },
     onError: (error) => {
      console.error("Delete member failed:", error);
    },
   
  });
    
};
