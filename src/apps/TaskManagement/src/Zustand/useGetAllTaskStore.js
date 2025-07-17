import { create } from "zustand";

export const useGetAllTaskStore = create((set) => ({
  allTask: [],
  setAllTask: (task) => {
    const sortTask = task.sort((a, b) => b.id - a.id);
    set({ allTask: sortTask });
  },
}));
