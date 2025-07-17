import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
// import icons from "@/constants/icons";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import DatePicker from "../DatePicker";
// import { axiosApi } from "@/lib/axiosApi";
import toast from "react-hot-toast";
// import { useWebSocket } from "@/hook/useWebSocket";
import { useUserData } from "../../hook/useUserData";
import { format } from "date-fns";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// import { useGetAllProjectData } from "@/hook/useGetAllprojectData";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import { useWebSocket } from "../../hook/useWebSocket";
import { useGetAllProjectData } from "../../hook/useGetAllprojectData";

const schema = z.object({
  project_name: z.string().min(3, "Task title is required"),
  project_requirements: z.string().min(3, "Bug details required"),
  project_startDate: z.date({ required_error: "Date is required" }),
  project_endDate: z.date({ required_error: "Date is required" }),
  project_status: z.enum(["To Do", "In Progress", "Completed"]),
  assign_with_ids: z.array(z.string()).optional(),
});

const FileInput = ({ label, icon, onChange, accept }) => (
  <label className="flex items-center gap-2 border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors">
    <img src={icon} alt={`${label} icon`} className="w-5 h-5" />
    <span className="text-sm text-gray-700">{label}</span>
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      className="hidden"
      aria-label={label}
    />
  </label>
);

const AddProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolvers, setShowSolvers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solvers, setSolvers] = useState([]);
  const [solversData, setSolversData] = useState([]);
  const [fileAttachment, setFileAttachment] = useState(null);
  const modalRef = useRef(null);
  const { sendMessage } = useWebSocket();
  const { user } = useUserData();
  const { refetch } = useGetAllProjectData();

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const response = await axiosApi.get("/users/getAll");
        const data = response.data.result.map((employee) => ({
          id: employee.id,
          src: employee.image || "/default-profile.png",
        }));
        setSolversData(data);
      } catch (error) {
        console.error("Failed to fetch solvers:", error);
        toast.error("Failed to load solvers. Please try again later.");
      }
    };
    fetchSolvers();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project_name: "",
      project_requirements: "",
      project_startDate: new Date(),
      project_endDate: null,
      project_status: "To Do",
      assign_with_ids: [],
    },
  });

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("project_name", values.project_name);
      formData.append("project_requirements", values.project_requirements);
      formData.append(
        "project_startDate",
        values.project_startDate.toISOString()
      );
      formData.append("project_endDate", values.project_endDate.toISOString());
      formData.append("project_status", values.project_status);
      formData.append("assign_with_ids", JSON.stringify(solvers));
      if (fileAttachment) formData.append("resource_files", fileAttachment);

      await axiosApi.post("/projects/create", formData);
      toast.success("Task created successfully!");
      try {
        const taskMessage = `<strong>Project Status:</strong><p>New Project waiting for you</p>`;
        sendMessage({
          type: "notify_specific",
          userIds: solvers.map(String),
          message: taskMessage,
          name: user.name.trim(),
          date: format(new Date(), "MM-dd-yyyy"),
          path: "/all-project",
        });
      } catch (error) {
        console.error("Failed to send notification:", error);
        toast.error("Failed to send notification. Please try again later.");
      }
      toggleModal();
      reset();
      setSolvers([]);
      refetch();
      setFileAttachment(null);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={toggleModal}
        className="flex items-center justify-center text-[#004368]  focus:ring-4 focus:ring-blue-300 font-medium rounded-full p-3 transition-colors"
        aria-label="Add new bug"
      >
        <Tooltip>
          <TooltipTrigger
            style={{
              backgroundColor: "#E6ECF0",
              borderRadius: "50%",
              padding: "0.75em 0.8em",
            }}
          >
            <Plus className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Project</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-transparent backdrop-blur-sm bg-opacity-50"
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onClick={toggleModal}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project name
                </label>
                <input
                  {...register("project_name")}
                  className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none autofill-black"
                  placeholder="Input Project Name Here"
                />
                {errors.project_name && (
                  <p className="text-sm text-red-500">
                    {errors.project_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="project_requirements"
                  className="block font-medium text-gray-700"
                >
                  Project Requirements
                </label>
                <textarea
                  id="project_requirements"
                  rows={4}
                  {...register("project_requirements")}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Project requirements here..."
                />
                {errors.project_requirements && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.project_requirements.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4 w-full">
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
                <label
                  htmlFor="project_status"
                  className="block font-medium text-gray-700"
                >
                  Status
                </label>
                <Select
                  value={watch("project_status")}
                  onValueChange={(val) =>
                    setValue("project_status", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="status"
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "white" }}>
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
                      <p className="text-sm text-gray-500">
                        No solvers selected
                      </p>
                    ) : (
                      solvers.map((id, idx) => {
                        const solver = solversData.find((s) => s.id === id);
                        if (!solver) return null;

                        return (
                          <img
                            key={idx}
                            src={solver.src}
                            alt={`Solver ${idx + 1}`}
                            className="w-8 h-8 rounded-full border border-gray-300"
                          />
                        );
                      })
                    )}

                    <div
                      onClick={() => setShowSolvers(true)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                      aria-label="Add solvers"
                    >
                      <Plus
                        className="w-4 h-4 text-gray-600"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {solversData.map((solver) => (
                      <div key={solver.id} className="flex items-center gap-2">
                        <img
                          src={solver.src}
                          alt={`Solver ${solver.id}`}
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <input
                          id={`checkbox-${solver.id}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm"
                          checked={solvers.includes(solver.id)}
                          onChange={(e) => {
                            setSolvers((prev) =>
                              e.target.checked
                                ? [...prev, solver.id]
                                : prev.filter((id) => id !== solver.id)
                            );
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowSolvers(false)}
                      className="text-[#004368] hover:text-[#003050] mt-2 text-sm font-medium"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div>
                <h4 className="font-medium text-gray-700">Resources</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <FileInput
                    label="Attach resource"
                    icon={icons.FilePin}
                    onChange={(e) => setFileAttachment(e.target.files[0])}
                    accept="application/pdf,text/plain"
                  />
                </div>
                {fileAttachment && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Attached file: {fileAttachment.name}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#004368] text-white py-2 rounded-md hover:bg-[#003050] transition-colors"
                disabled={isLoading}
                style={{ backgroundColor: "#004368" }}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AddProject;
