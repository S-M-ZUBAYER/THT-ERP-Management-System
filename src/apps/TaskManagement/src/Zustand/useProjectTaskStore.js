import { create } from "zustand";

export const useProjectTaskStore = create((set) => ({
  tasks: [],
  setTasks: (tas) => {
    const sortTask = tas.sort((a, b) => b.taskInfo.id - a.taskInfo.id);
    set({ tasks: sortTask });
  },
}));
