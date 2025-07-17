import { create } from "zustand";

const useTaskReportStore = create((set) => ({
  tasksReport: null,
  setTasksReport: (taskReportData) => set({ tasksReport: taskReportData }),
}));

export default useTaskReportStore;
