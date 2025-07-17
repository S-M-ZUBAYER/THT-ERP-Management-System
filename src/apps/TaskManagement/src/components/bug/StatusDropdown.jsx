import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
// import { useBugData } from "@/hook/useBugData";
// import { useWebSocket } from "@/hook/useWebSocket";
import { format } from "date-fns";
import { useUserData } from "../../hook/useUserData";
import { axiosApi } from "../../lib/axiosApi";
import { useWebSocket } from "../../hook/useWebSocket";
import { useBugData } from "../../hook/useBugData";

export default function StatusDropdown({ current, id, bugName }) {
  const [status, setStatus] = useState(current); // internal status state
  const { id: projectId, projectName, fetchBugsById } = useBugData();
  const { sendMessage } = useWebSocket();
  const { user } = useUserData();

  useEffect(() => {
    setStatus(current);
  }, [current]);

  const updateStatus = async (value) => {
    try {
      await axiosApi.post(`/bugStatus/${id}`, { status: value });
      setStatus(value);
      toast.success("Bug status updated successfully");
      fetchBugsById();

      sendMessage({
        type: "notify_admins",
        message: `Bug "${bugName}" status updated to ${value}`,
        name: user.name.trim(),
        date: format(new Date(), "MM-dd-yyyy"),
        path: `/bug-details/${projectId}/${projectName}`,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update bug status"
      );
    }
  };

  return (
    <Select value={status} onValueChange={updateStatus}>
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
        <SelectItem value="Solved">Solved</SelectItem>
        <SelectItem value="In Progress">In progress</SelectItem>
        <SelectItem value="Pending">Not started</SelectItem>
      </SelectContent>
    </Select>
  );
}
