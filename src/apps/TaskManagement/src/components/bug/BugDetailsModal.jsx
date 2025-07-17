import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserAvatars from "./UserAvatars";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
// import { useUserData } from "../../hook/useUserData";
// import { useWebSocket } from "@/hook/useWebSocket";
import { format } from "date-fns";
// import { useBugData } from "@/hook/useBugData";
import { useUserData } from "../../hook/useUserData";
import { axiosApi } from "../../lib/axiosApi";
import { useWebSocket } from "../../hook/useWebSocket";
import { useBugData } from "../../hook/useBugData";
const schema = z.object({
  BugDetails: z.string().min(1, "Details are required"),
  remark: z.enum(["Not Checked", "Not Solved", "Completed"]),
});

export default function BugDetailsModal({ isOpen, onClose, bug }) {
  const { id: projectId, projectName, fetchBugsById } = useBugData();
  const { admin, user } = useUserData();
  const { sendMessage } = useWebSocket();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      BugDetails: bug.BugDetails || "",
      remark: bug.remark || "Not Checked",
    },
  });

  useEffect(() => {
    if (bug) {
      form.reset({
        BugDetails: bug.BugDetails || "",
        remark: bug.remark || "Not Checked",
      });
    }
  }, [bug, form]);

  if (!isOpen || !bug) return null;

  const {
    BugTitle,
    BugDetails,
    findDate,
    solveDate,
    priority,
    status,
    attachmentFile,
    assignWith,
    id,
  } = bug;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosApi.post(`/update/remarkDetails/${id}`, data);
      if (res.status === 200) {
        toast.success("Bug details submitted successfully!");
        try {
          sendMessage({
            type: "notify_specific",
            userIds: assignWith.map((u) => String(u.id)),
            message: `<strong class="w-[150px]">Bug Status:</strong><p>${BugTitle} Bug remark status update to ${data.remark}</p>`,
            name: user.name.trim(),
            date: format(new Date(), "MM-dd-yyyy"),
            path: `/bug-details/${projectId}/${projectName}`,
          });
        } catch (error) {
          console.error("Error sending WebSocket message:", error);
          toast.error("Failed to send notification.");
        }
      } else {
        toast.error("Failed to submit bug details.");
      }
      fetchBugsById();
      onClose();
    } catch (error) {
      console.error("Error submitting bug details:", error);
      toast.error("Failed to submit bug details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black bg-[#E6ECF0] rounded-full p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </div>

            <h2 className="text-xl font-semibold mb-4">Bug Details</h2>

            <form
              className="space-y-2 text-sm"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="mb-2">
                <strong>Title:</strong>
                <div className="border border-gray-400 rounded p-2">
                  <p>{BugTitle}</p>
                </div>
              </div>

              {/* Bug Details Input */}
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
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 custom-scrollbar"
                  placeholder="Describe the bug..."
                  disabled={!admin}
                />
                {form.formState.errors.BugDetails && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.BugDetails.message}
                  </p>
                )}
              </div>

              {/* Static Fields */}
              <div className="mb-2">
                <strong>Status:</strong>
                <div className="border border-gray-400 rounded p-2">
                  <p>{status}</p>
                </div>
              </div>
              <div className="mb-2">
                <strong>Priority:</strong>
                <div className="border border-gray-400 rounded p-2">
                  <p>{priority}</p>
                </div>
              </div>
              <div className="mb-2">
                <strong>Found:</strong>{" "}
                {findDate ? new Date(findDate).toLocaleDateString() : "—"}
              </div>
              <p>
                <strong>Solved:</strong>{" "}
                {solveDate ? new Date(solveDate).toLocaleDateString() : "—"}
              </p>
              <p>
                <strong>Attachment:</strong>{" "}
                {attachmentFile ? (
                  <a
                    href={attachmentFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                ) : (
                  "None"
                )}
              </p>

              {/* Assigned Users */}
              <div>
                <strong>Assigned Users:</strong>
                <ul className="list-disc list-inside">
                  <UserAvatars users={assignWith} />
                </ul>
              </div>

              {/* Remark Dropdown */}
              <div>
                <label
                  htmlFor="remark"
                  className="block font-medium text-gray-700"
                >
                  Remark
                </label>
                <Select
                  value={form.watch("remark")}
                  onValueChange={(val) =>
                    form.setValue("remark", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="remark"
                    className="w-full mt-1 border-[#B0C5D0] focus:ring-[#004368] focus:border-[#004368] text-[#2B2B2B]"
                    style={{ backgroundColor: "white", outline: "none" }}
                    disabled={!admin}
                  >
                    <SelectValue placeholder="Select remark" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "white" }}>
                    <SelectItem value="Not Checked">Not Checked</SelectItem>
                    <SelectItem value="Not Solved">Not Solved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.remark && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.remark.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              {admin && (
                <div className="pt-2">
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
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
