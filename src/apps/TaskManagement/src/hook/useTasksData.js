import { useEffect, useState } from "react";
// import { axiosApi } from "@/lib/axiosApi";
// import useTasksStore from "@/Zustand/useTasksStore";
import { axiosApi } from "../lib/axiosApi";
import useTasksStore from "../Zustand/useTasksStore";

const statusMap = {
  "To Do": 0,
  "In Progress": 1,
  Completed: 2,
};

export default function useTaskColumns() {
  const { tasksByStatus, setTasksByStatus, tasks, setTasks } = useTasksStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get("/all-task-details/getAll");
      const taskData = response.data?.data || [];

      setTasks(taskData);

      const grouped = [[], [], []];

      taskData.forEach(({ taskInfo }) => {
        if (!taskInfo) return;

        const {
          id,
          task_title,
          task_details,
          task_deadline,
          task_completing_date,
          assigned_employee_ids,
          status,
        } = taskInfo;

        const index = statusMap[status] ?? 0;

        grouped[index].push({
          id,
          title: task_title,
          description: task_details,
          deadline: task_deadline,
          completed: task_completing_date,
          employees: assigned_employee_ids || [],
        });
      });

      setTasksByStatus(grouped);
      setError(null);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasksByStatus.flat().length === 0) {
      fetchTasks();
    }
  }, []);

  const removeTaskById = (idToRemove) => {
    const updated = tasksByStatus.map((group) =>
      group.filter((task) => task.id !== idToRemove)
    );
    setTasksByStatus(updated);
  };

  return {
    tasksByStatus,
    error,
    loading,
    tasks,
    fetchTasks,
    removeTaskById,
  };
}
