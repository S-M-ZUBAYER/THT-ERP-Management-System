import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Plus } from "lucide-react";
import toast from "react-hot-toast";

// import { axiosApi } from "@/lib/axiosApi";
import DatePicker from "../DatePicker";
import { axiosApi } from "../../lib/axiosApi";
import useTaskData from "../../hook/useTaskData";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  details: z.string().min(3, "Details required"),
  discussion_date: z.date({ required_error: "Date is required" }),
  discussion_with_ids: z.array(z.string()).optional(),
});

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const UpdateDiscuss = ({ discussion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolvers, setShowSolvers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solvers, setSolvers] = useState(
    discussion?.discussion_with_users?.map((u) => u.id) || []
  );
  const [solversData, setSolversData] = useState([]);
  const { fetchTaskById } = useTaskData();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: discussion.title,
      details: discussion.details,
      discussion_date: new Date(discussion.discussion_date),
      discussion_with_ids: [],
    },
  });

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
        } else throw new Error("Invalid response");
      } catch (error) {
        toast.error("Failed to load solvers.");
        console.error("Fetch solvers error:", error);
        setSolversData([]);
      }
    };
    fetchSolvers();
  }, []);

  useEffect(() => {
    if (isOpen && discussion) {
      form.reset({
        title: discussion.title,
        details: discussion.details,
        discussion_date: new Date(discussion.discussion_date),
        discussion_with_ids: [],
      });
      setSolvers(discussion.discussion_with_users?.map((u) => u.id) || []);
    }
  }, [isOpen, discussion, form]);

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

      const res = await axiosApi.post(
        `/taskDiscussion/update/${discussion.id}`,
        formData
      );

      if (res.status === 200) {
        toast.success("Discussion updated successfully!");
        setIsOpen(false);
        form.reset();
        setSolvers([]);
        fetchTaskById();
      }
    } catch (error) {
      toast.error("Failed to update discussion");
      console.error("Update discussion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center text-[#004368] bg-[#E6ECF0] hover:bg-[#D6E6F0] rounded-full p-3"
        aria-label="edit discussion"
      >
        <Edit className="w-4 h-4" />
      </div>

      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="backdrop"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={backdropVariants}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              >
                <motion.div
                  key="modal"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative space-y-6"
                >
                  <div
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </div>

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        {...form.register("title")}
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">
                        Details
                      </label>
                      <textarea
                        {...form.register("details")}
                        rows={4}
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                      />
                      {form.formState.errors.details && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.details.message}
                        </p>
                      )}
                    </div>

                    <DatePicker
                      form={form}
                      name="discussion_date"
                      label="Discussion Date"
                    />

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Discussion With
                      </h4>
                      {!showSolvers ? (
                        <div className="flex items-center gap-2">
                          {solvers.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No solvers selected
                            </p>
                          ) : (
                            solvers.map((id) => {
                              const solver = solversData.find(
                                (s) => s.id === id
                              );
                              return (
                                solver && (
                                  <img
                                    key={id}
                                    src={solver.src}
                                    className="w-8 h-8 rounded-full border"
                                    alt="solver"
                                  />
                                )
                              );
                            })
                          )}
                          <div
                            onClick={() => setShowSolvers(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {solversData.map((solver) => (
                            <div
                              key={solver.id}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={solver.src}
                                className="w-8 h-8 rounded-full border"
                                alt={`solver-${solver.id}`}
                              />
                              <input
                                type="checkbox"
                                checked={solvers.includes(solver.id)}
                                onChange={(e) => {
                                  setSolvers((prev) =>
                                    e.target.checked
                                      ? [...prev, solver.id]
                                      : prev.filter((id) => id !== solver.id)
                                  );
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setShowSolvers(false)}
                            className="text-sm px-3 py-1 bg-[#E6ECF0] rounded-md hover:text-[#003050]"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: "#004368",
                        outline: "none",
                        color: "white",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                      }}
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default UpdateDiscuss;
