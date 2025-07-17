import { create } from "zustand";

export const useTaskStore = create((set) => ({
  task: null,
  setTask: (taskData) => set({ task: taskData }),
}));
