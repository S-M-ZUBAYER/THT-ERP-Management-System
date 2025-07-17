import { create } from "zustand";

export const useProjectStore = create((set) => ({
  project: [],
  setProject: (pro) => {
    const sortProject = pro.sort((a, b) => b.projectInfo.id - a.projectInfo.id);
    set({ project: sortProject });
  },
}));
