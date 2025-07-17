// import { axiosApi } from "@/lib/axiosApi";
// import useTaskReportStore from "@/Zustand/useTaskReportStore";
import { useEffect } from "react";
import { axiosApi } from "../lib/axiosApi";
import useTaskReportStore from "../Zustand/useTaskReportStore";

export const useTaskReportData = () => {
  const { tasksReport, setTasksReport } = useTaskReportStore();
  const getTasksReport = async () => {
    try {
      const res = await axiosApi.get("/dailyTaskReport/get/all");
      setTasksReport(res.data.result);
    } catch (error) {
      console.error("Failed to fetch task Report:", error);
    }
  };
  useEffect(() => {
    getTasksReport();
  }, []);
  return {
    tasksReport,
    getTasksReport,
  };
};
