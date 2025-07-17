import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { X, Plus } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
// import icons from "@/constants/icons";
import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
import DatePicker from "../DatePicker";
// import { useBugData } from "@/hook/useBugData";
// import { useWebSocket } from "@/hook/useWebSocket";
import { format } from "date-fns";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import { useWebSocket } from "../../hook/useWebSocket";
import { useBugData } from "../../hook/useBugData";

const schema = z.object({
  BugTitle: z.string().min(3, "Bug name is required"),
  BugDetails: z.string().min(3, "Bug details required"),
  findDate: z.date({ required_error: "Date is required" }),
  priority: z.enum(["Low", "Medium", "High"]),
  assignWith: z.array(z.string()).optional(),
  fileAttachment: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => !file || ["application/pdf", "text/plain"].includes(file.type),
      "Only PDF or text files are allowed"
    ),
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

const AddBug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolvers, setShowSolvers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solvers, setSolvers] = useState([]);
  const [solversData, setSolversData] = useState([]);
  const [fileAttachment, setFileAttachment] = useState(null);
  const modalRef = useRef(null);
  const { id, projectName, fetchBugsById } = useBugData();
  const user = JSON.parse(localStorage.getItem("user"));
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const response = await axiosApi.get("/users/getAll");
        if (response.status === 200 && response.data.result) {
          const data = response.data.result.map((employee) => ({
            id: employee.id,
            src: employee.image || "/default-profile.png",
          }));
          setSolversData(data);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Failed to fetch solvers:", error);
        toast.error("Failed to load solvers. Please try again later.");
        setSolversData([]);
      }
    };
    fetchSolvers();
  }, []);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      BugTitle: "",
      BugDetails: "",
      findDate: new Date(),
      priority: "Medium",
      solvers: [],
      fileAttachment: null,
    },
  });

  const toggleModal = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      });
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    }
  }, [isOpen]);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (!projectName || !id || !user.email) {
        throw new Error("Bug store data is incomplete");
      }

      const formData = new FormData();
      formData.append("projectName", projectName);
      formData.append("BugTitle", values.BugTitle);
      formData.append("BugDetails", values.BugDetails);
      formData.append("findDate", values.findDate.toISOString().split("T")[0]);
      formData.append("priority", values.priority);
      formData.append("status", "Pending");
      formData.append("assignWith", JSON.stringify(solvers));
      formData.append("bugProjectId", id);
      formData.append("createdEmail", user.email);
      formData.append("remark", "Not Checked");
      if (fileAttachment) formData.append("attachmentFile", fileAttachment);

      const res = await axiosApi.post("/bug/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Bug reported successfully!");
        try {
          const bugMessage = `<strong>Bug Status:</strong><p>New bug waiting for you</p>`;
          sendMessage({
            type: "notify_specific",
            userIds: solvers.map(String),
            message: bugMessage,
            name: user.name.trim(),
            date: format(new Date(), "MM-dd-yyyy"),
            path: `/bug-details/${id}/${projectName}`,
          });
        } catch (error) {
          console.error("Error sending WebSocket message:", error);
        }
        toggleModal();
        form.reset();
        setSolvers([]);
        setFileAttachment(null);
        await fetchBugsById();
      }
    } catch (error) {
      console.error("Error submitting bug:", error);
      toast.error(error.message || "Failed to report bug");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={toggleModal}
        className="flex items-center justify-center text-[#004368] bg-[#E6ECF0] hover:bg-[#D6E6F0] focus:ring-4 focus:ring-blue-300 font-medium rounded-full p-3 transition-colors"
        aria-label="Add new bug"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent backdrop-blur-sm bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative space-y-6"
          >
            <div
              onClick={toggleModal}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Bug Name */}
              <div>
                <label
                  htmlFor="details"
                  className="block font-medium text-gray-700"
                >
                  Bug Title
                </label>
                <input
                  id="title"
                  {...form.register("BugTitle")}
                  className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-gray-700 focus:border-blue-500 focus:ring-blue-500  autofill-black"
                  placeholder="Describe the discuss BugTitle..."
                />
                {form.formState.errors.BugTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.BugTitle.message}
                  </p>
                )}
              </div>

              {/* Bug Details */}
              <div>
                <label
                  htmlFor="details"
                  className="block font-medium text-gray-700"
                >
                  Bug Details
                </label>
                <textarea
                  id="details"
                  rows={4}
                  {...form.register("BugDetails")}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the bug..."
                />
                {form.formState.errors.BugDetails && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.BugDetails.message}
                  </p>
                )}
              </div>

              {/* Find Date */}
              <DatePicker form={form} name="findDate" label="Find Date" />

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block font-medium text-gray-700"
                >
                  Priority
                </label>
                <Select
                  onValueChange={(val) =>
                    form.setValue("priority", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="priority"
                    className="w-full mt-1 border-[#B0C5D0] focus:ring-[#004368] focus:border-[#004368] text-[#2B2B2B]"
                    style={{ backgroundColor: "white", outline: "none" }}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.priority && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.priority.message}
                  </p>
                )}
              </div>

              {/* Bug Solver */}
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
                            alt={`Selected solver ${idx + 1}`}
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
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500"
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
                      className="bg-[#E6ECF0] text-[#004368] hover:text-[#003050] mt-2 text-sm font-medium transition-colors px-3 py-1 rounded-md"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div>
                <h4 className="font-medium text-gray-700">Bug Attachments</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <FileInput
                    label="Bug files"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full  text-white py-2 rounded-md hover:bg-[#003050] transition-colors focus:ring-4 focus:ring-blue-300"
                disabled={isLoading}
                style={{ backgroundColor: "#004368", outline: "none" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                      />
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Bug Details"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBug;
