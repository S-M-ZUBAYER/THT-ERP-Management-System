import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { X, Plus } from "lucide-react";

import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
import DatePicker from "../DatePicker";
// import { useWebSocket } from "@/hook/useWebSocket";
import { useUserData } from "../../hook/useUserData";
import { format } from "date-fns";
import { axiosApi } from "../../lib/axiosApi";
import { useWebSocket } from "../../hook/useWebSocket";
import useTaskData from "../../hook/useTaskData";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  details: z.string().min(3, "Details required"),
  discussion_date: z.date({ required_error: "Date is required" }),
  discussion_with_ids: z.array(z.string()).optional(),
});

const AddDiscuss = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolvers, setShowSolvers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solvers, setSolvers] = useState([]);
  const [solversData, setSolversData] = useState([]);
  const modalRef = useRef(null);
  const { id, fetchTaskById } = useTaskData();
  const { sendMessage } = useWebSocket();
  const { user } = useUserData();

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
      title: "",
      details: "",
      discussion_date: new Date(),
      solvers: [],
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
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("details", values.details);
      formData.append(
        "discussion_date",
        new Date(values.discussion_date).toISOString()
      );
      formData.append("discussion_with_ids", JSON.stringify(solvers));
      formData.append("task_id", id);

      const res = await axiosApi.post("/taskDiscussion/create", formData);

      if (res.status === 201) {
        toast.success("Bug reported successfully!");
        try {
          sendMessage({
            type: "notify_specific",
            userIds: solvers.map(String),
            message: "New discussion created",
            name: user.name.trim(),
            date: format(new Date(), "MM-dd-yyyy"),
            path: `/task-details/${id}`,
          });
        } catch (error) {
          console.error("Error sending notification:", error);
          toast.error("Failed to send notification.");
        }
        toggleModal();
        form.reset();
        setSolvers([]);
        fetchTaskById();
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

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-[0.8vw] font-normal "
            >
              {/* Discussion Title */}
              <div>
                <label
                  htmlFor="details"
                  className="block font-medium text-gray-700"
                >
                  Discussion Title
                </label>
                <input
                  id="title"
                  {...form.register("title")}
                  className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 "
                  placeholder="Describe the discuss title"
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Discuss Details */}
              <div>
                <label
                  htmlFor="details"
                  className="block font-medium text-gray-700"
                >
                  Discussion Details
                </label>
                <textarea
                  id="details"
                  rows={4}
                  {...form.register("details")}
                  className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 "
                  placeholder="Describe the discuss Details"
                />
                {form.formState.errors.details && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.details.message}
                  </p>
                )}
              </div>

              {/* Find Date */}
              <DatePicker
                form={form}
                name="discussion_date"
                label="Discussion Date"
              />

              {/* Bug Solver */}
              <div>
                <h4 className="font-medium text-gray-700">Discussion With</h4>
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
                      style={{
                        backgroundColor: "#004368",
                        color: "white",
                      }}
                    >
                      Done
                    </button>
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
                  "Submit Discussion"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDiscuss;
