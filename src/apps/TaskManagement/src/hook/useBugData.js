import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { axiosApi } from "@/lib/axiosApi";
// import { useBugStore } from "@/Zustand/useBugsStore";
import { axiosApi } from "../lib/axiosApi";
import { useBugStore } from "../Zustand/useBugsStore";

export const useBugData = () => {
  const { id, bugProjectName } = useParams();

  const { bugs, setBugs } = useBugStore();

  const fetchBugsById = async (projectId = id) => {
    if (!projectId) {
      console.warn("fetchBugsById called with no projectId");
      return;
    }
    try {
      const res = await axiosApi.get(
        `/projectBug/with-bugs/getById/${projectId}`
      );
      setBugs(res.data.result?.bugs || []);
    } catch (error) {
      console.error("Failed to fetch bugs:", error);
    }
  };

  useEffect(() => {
    fetchBugsById();
  }, [id]);

  return {
    id,
    bugs,
    projectName: bugProjectName || "",
    fetchBugsById,
  };
};
