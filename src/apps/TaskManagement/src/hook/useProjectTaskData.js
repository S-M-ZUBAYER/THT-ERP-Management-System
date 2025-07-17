import { useEffect, useState } from "react";
// import { axiosApi } from "@/lib/axiosApi";
// import { useProjectTaskStore } from "@/Zustand/useProjectTaskStore";
import { useParams } from "react-router-dom";
import { axiosApi } from "../lib/axiosApi";
import { useProjectTaskStore } from "../Zustand/useProjectTaskStore";

export const useProjectTaskData = () => {
  const { tasks, setTasks } = useProjectTaskStore();
  const { projectName } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const getProjectTask = async () => {
    setIsLoading(true);
    try {
      const res = await axiosApi(`/task-details/projectName/${projectName}`);

      if (res.status === 500) {
        setTasks([]);
      } else {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectName) {
      getProjectTask();
    }
  }, [projectName]);

  return {
    tasks,
    getProjectTask,
    isLoading,
    projectName,
  };
};
