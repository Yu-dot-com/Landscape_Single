import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import type { signupType } from "../pages/SignUp";
import type { loginType } from "../pages/Login";
import type { userTypes } from "../types/authTypes";

export const signup = async (data: signupType) => {
  return await apiClient.post("/register", data);
};
export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};

export const login = async (data: loginType) => {
  return await apiClient.post("/login", data);
};
export const useLogin = () => {
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const getCurrentUser = async ():Promise<userTypes> => {
  return (await apiClient.get("/me")) as userTypes;
  
};
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};

export const updateName = async(id:string,name:string) => {
  return await apiClient.patch(`/updateName/${id}`,{name})
}
export const useUpdateName = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({id,name}:{id:string,name:string}) => updateName(id,name),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ["currentUser"]})
    },
    onError: (error) => {
      console.error("Failed to update name", error);
    }
  })
}
