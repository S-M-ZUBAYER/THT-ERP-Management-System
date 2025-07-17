import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
// import useTaskData from "../hook/useTaskData";
// import useTaskColumns from "@/hook/useTasksData";
import { useUserData } from "../../hook/useUserData";
// import { useWebSocket } from "@/hook/useWebSocket";
import { format } from "date-fns";
import { axiosApi } from "../../lib/axiosApi";
import { useWebSocket } from "../../hook/useWebSocket";
import useTaskData from "../../hook/useTaskData";
import useTaskColumns from "../../hook/useTasksData";
const TaskStatus = ({ current, assign }) => {
  const { user } = useUserData();
  const { id } = useTaskData();
  const { fetchTasks } = useTaskColumns();
  const authorized = assign.some((item) => item.id === user.id);
  const { sendMessage } = useWebSocket();
  const updateStatus = async (value) => {
    try {
      await axiosApi.post(`/taskStatus/${id}`, { status: value });
      toast.success("Task status updated successfully");
      try {
        sendMessage({
          type: "notify_admins",
          message: `<strong class="w-[100px]">Task Status:</strong> <p>updated to ${value} by ${user.name.trim()}<p/>`,
          name: user.name.trim(),
          date: format(new Date(), "MM-dd-yyyy"),
          path: `/task-details/${id}`,
        });
      } catch (error) {
        console.error("Error updating bug status:", error);
        toast.error(
          error.response?.data?.message || "Failed to notify task status"
        );
      }
      fetchTasks();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update bug status"
      );
    }
  };
  return (
    <div className="flex justify-between items-center ">
      <h3 className="font-semibold mb-2 text-[#004368] ">Status</h3>
      <div className="px-4 py-1 text-sm flex gap-6 border border-[#B0C5D0] rounded-[1vh] text-[#004368]">
        {authorized ? (
          <Select defaultValue={current} onValueChange={updateStatus}>
            <SelectTrigger
              style={{
                backgroundColor: "transparent",
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div>{current} </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatus;
