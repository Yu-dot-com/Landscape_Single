import { create } from "zustand";

interface DashboardState {
  isCreateProjectModalOpen: boolean;
  setIsCreateProjectModalOpen: (isOpen: boolean) => void;
  selectedProjectId:string | null;
  setSelectedProjectId:(id:string|null)=>void;
  isProfileOpen:boolean;
  setIsProfileOpen: (isOpen: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedProjectId:null,
  setSelectedProjectId:(id)=>set({selectedProjectId:id}),
  isCreateProjectModalOpen: false,
  setIsCreateProjectModalOpen: (isOpen) => set({ isCreateProjectModalOpen: isOpen }),
  isProfileOpen: false,
  setIsProfileOpen: (isOpen) => set({isProfileOpen:isOpen})
}));