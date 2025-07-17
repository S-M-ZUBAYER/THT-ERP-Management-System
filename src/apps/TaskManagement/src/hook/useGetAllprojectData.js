// import { axiosApi } from "@/lib/axiosApi";
// import { useProjectStore } from "@/Zustand/useProjectStore";
import { useEffect, useState } from "react";
import { axiosApi } from "../lib/axiosApi";
import { useProjectStore } from "../Zustand/useProjectStore";

export const useGetAllProjectData = () => {
  const { project, setProject } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const getAllProject = async () => {
    setIsLoading(true);
    try {
      const response = await axiosApi.get("/projects/getAll");

      if (response.status === 500) {
        setProject([]);
      } else {
        setProject(response.data?.data || []);
      }
    } catch (error) {
      console.error("All project error:", error);
      setProject([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!project || project.length === 0) {
      getAllProject();
    }
  }, []);

  return { project, refetch: getAllProject, isLoading };
};
