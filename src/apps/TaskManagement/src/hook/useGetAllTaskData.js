import { useState, useEffect } from "react";
// import { axiosApi } from "@/lib/axiosApi";
// import { useGetAllTaskStore } from "@/Zustand/useGetAllTaskStore";
import { axiosApi } from "../lib/axiosApi";
import { useGetAllTaskStore } from "../Zustand/useGetAllTaskStore";

export const useGetAllTaskData = () => {
  const { allTask, setAllTask } = useGetAllTaskStore();
  const [loading, setLoading] = useState(false);

  const GetAllTaskfetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get("/ProjectListWithTasks");
      setAllTask(response?.data?.result);
      if (response.status === 500) {
        setAllTask([]);
      } else {
        setAllTask(response?.data?.result);
      }
    } catch (error) {
      console.error("Error fetching bugs:", error);
      setAllTask([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(allTask) || allTask.length === 0) {
      GetAllTaskfetchTasks();
    }
  }, []);

  return {
    loading,
    allTask,
    GetAllTaskfetchTasks,
  };
};
