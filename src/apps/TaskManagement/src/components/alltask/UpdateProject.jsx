import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

// import { axiosApi } from "@/lib/axiosApi";
// import { useWebSocket } from "../hook/useWebSocket";
// import { useUserData } from "../../hook/useUserData";
// import { useGetAllProjectData } from "@/hook/useGetAllprojectData";

import DatePicker from "../DatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
// import { useProjectUpdateStore } from "@/Zustand/useProjectUpdateStore";
// import { useGetAllTaskData } from "@/hook/useGetAllTaskData";
import { useProjectUpdateStore } from "../../Zustand/useProjectUpdateStore";
import { useUserData } from "../../hook/useUserData";
import { axiosApi } from "../../lib/axiosApi";
import { useGetAllTaskData } from "../../hook/useGetAllTaskData";
import { useWebSocket } from "../../hook/useWebSocket";
import { useGetAllProjectData } from "../../hook/useGetAllprojectData";

const schema = z.object({
  project_name: z.string().min(3, "Project name is required"),
  project_requirements: z.string().min(3, "Requirements are required"),
  project_startDate: z.date(),
  project_endDate: z.date(),
  project_status: z.enum(["To Do", "In Progress", "Completed"]),
});

const UpdateProject = () => {
  const { projectDetails, setShowUpdateModal } = useProjectUpdateStore();
  const [solversData, setSolversData] = useState([]);
  const [solvers, setSolvers] = useState(
    projectDetails.assign_with_ids?.split(",") || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSolvers, setShowSolvers] = useState(false);

  const { sendMessage } = useWebSocket();
  const { user } = useUserData();
  const { refetch } = useGetAllProjectData();
  const { GetAllTaskfetchTasks } = useGetAllTaskData();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project_name: projectDetails.project_name,
      project_requirements: projectDetails.project_requirements,
      project_startDate: new Date(projectDetails.project_startDate),
      project_endDate: new Date(projectDetails.project_endDate),
      project_status: projectDetails.project_status,
    },
  });

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const res = await axiosApi.get("/users/getAll");
        const result = res.data.result.map((emp) => ({
          id: emp.id.toString(),
          src: emp.image || "/default-profile.png",
        }));
        setSolversData(result);
      } catch (error) {
        toast.error("Failed to fetch users");
        console.error(error);
      }
    };
    fetchSolvers();
  }, []);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const submissionData = {
        ...values,
        project_startDate: format(values.project_startDate, "yyyy-MM-dd"),
        project_endDate: format(values.project_endDate, "yyyy-MM-dd"),
        assign_with_ids: solvers.map(Number),
      };
      await axiosApi.post(
        `/projects/update/${projectDetails.id}`,
        submissionData
      );

      toast.success("Project updated successfully");

      sendMessage({
        type: "notify_specific",
        userIds: solvers,
        message:
          "<strong>Task Updated:</strong><p>Please review the changes.</p>",
        name: user.name.trim(),
        date: format(new Date(), "MM-dd-yyyy"),
        path: `/task-details/${projectDetails.id}`,
      });

      refetch();
      GetAllTaskfetchTasks();
      setShowUpdateModal(false);
    } catch (err) {
      toast.error("Failed to update project.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent backdrop-blur-sm bg-opacity-10"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative space-y-6">
        <div
          onClick={() => setShowUpdateModal(false)}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-gray-600" />
        </div>

        <h2 className="text-xl font-semibold">Update Project</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label>Project Name</label>
            <input
              {...register("project_name")}
              className="w-full border rounded p-2"
            />
            {errors.project_name && (
              <p className="text-sm text-red-600">
                {errors.project_name.message}
              </p>
            )}
          </div>

          <div>
            <label>Requirements</label>
            <textarea
              rows={3}
              {...register("project_requirements")}
              className="w-full border rounded p-2"
            />
            {errors.project_requirements && (
              <p className="text-sm text-red-600">
                {errors.project_requirements.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <DatePicker
                form={{ watch, setValue, formState: { errors } }}
                name="project_startDate"
                label="Start Date"
              />
            </div>
            <div className="w-1/2">
              <DatePicker
                form={{ watch, setValue, formState: { errors } }}
                name="project_endDate"
                label="End Date"
              />
            </div>
          </div>

          <div>
            <label>Status</label>
            <Select
              value={watch("project_status")}
              onValueChange={(val) => setValue("project_status", val)}
            >
              <SelectTrigger
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  color: "#2B2B2B",
                  font: "inherit",
                  border: "1px solid #B0C5D0",
                  boxShadow: "none",
                  width: "100%",
                }}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent
                className={"w-auto p-0 z-[9999] rounded-md shadow-lg"}
                style={{ backgroundColor: "white" }}
              >
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Assign task to</h4>
            {!showSolvers ? (
              <div className="flex items-center gap-2 mt-2">
                {solvers.length === 0 ? (
                  <p className="text-sm text-gray-500">No solvers selected</p>
                ) : (
                  solvers.map((id) => {
                    const solver = solversData.find((s) => s.id === id);
                    return (
                      solver && (
                        <img
                          key={id}
                          src={solver.src}
                          alt="Solver"
                          className="w-8 h-8 rounded-full border"
                        />
                      )
                    );
                  })
                )}
                <div
                  onClick={() => setShowSolvers(true)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-2">
                {solversData.map((solver) => (
                  <div key={solver.id} className="flex items-center gap-2">
                    <img
                      src={solver.src}
                      alt={`Solver ${solver.id}`}
                      className="w-8 h-8 rounded-full border"
                    />
                    <input
                      type="checkbox"
                      checked={solvers.includes(solver.id)}
                      onChange={(e) =>
                        setSolvers((prev) =>
                          e.target.checked
                            ? [...prev, solver.id]
                            : prev.filter((id) => id !== solver.id)
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowSolvers(false)}
                  className="bg-[#E6ECF0] text-[#004368] mt-2 text-sm font-medium px-3 py-1 rounded-md hover:text-[#003050]"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            disabled={isLoading}
            style={{ backgroundColor: "#004368" }}
          >
            {isLoading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProject;
