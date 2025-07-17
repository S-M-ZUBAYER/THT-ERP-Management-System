import { create } from "zustand";

export const useProjectUpdateStore = create((set) => ({
  showUpdateModal: false,
  setShowUpdateModal: (toggle) => set({ showUpdateModal: toggle }),
  projectDetails: null,
  setProjectDetails: (details) => set({ projectDetails: details }),
}));
