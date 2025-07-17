import { create } from "zustand";

const useTasksStore = create((set) => ({
  tasksByStatus: [[], [], []],
  tasks: [],
  setTasks: (tasks) => {
    const sortedMessages = tasks.sort((a, b) => b.taskInfo.id - a.taskInfo.id);
    set({ tasks: sortedMessages });
  },
  setTasksByStatus: (statusGroupedTasks) =>
    set({ tasksByStatus: statusGroupedTasks }),
}));

export default useTasksStore;
