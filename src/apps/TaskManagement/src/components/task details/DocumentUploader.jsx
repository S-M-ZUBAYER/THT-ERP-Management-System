import React, { useState, useCallback } from "react";
import UploadingView from "./UploadingView";
import UploadedView from "./UploadedView";
// import { axiosApi } from "@/lib/axiosApi";
import toast from "react-hot-toast";
// import { useWebSocket } from "@/hook/useWebSocket";
import { format } from "date-fns";
import { useUserData } from "../../hook/useUserData";
import { useTaskStore } from "../../Zustand/useTaskStore";
import { axiosApi } from "../../lib/axiosApi";
import { useWebSocket } from "../../hook/useWebSocket";
import useTaskData from "../../hook/useTaskData";
import useTaskColumns from "../../hook/useTasksData";
export default function DocumentUploader({ title }) {
  const [uploadState, setUploadState] = useState("idle");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const { id, fetchTaskById } = useTaskData();
  const { sendMessage } = useWebSocket();
  const { user } = useUserData();
  const { task } = useTaskStore();
  const { taskInfo } = task;
  const { fetchTasks } = useTaskColumns();

  const handleFile = (selectedFiles) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setUploadState("uploading");

    setTimeout(() => {
      setUploadState("uploaded");
    }, 1000);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) handleFile(selectedFiles);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) handleFile(droppedFiles);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleRemove = () => {
    setFiles([]);
    setUploadState("idle");
  };

  const handleSubmit = async () => {
    if (uploadState !== "uploaded" || files.length === 0) return;

    const isResource = title === "Resources";
    const endpoint = isResource ? "/resource/create" : "/test-reports/upload";
    const fileFieldName = isResource ? "resource_file" : "report_file";

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fileFieldName, file);
    });

    formData.append("task_id", id);

    try {
      await axiosApi.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      try {
        sendMessage({
          type: "notify_specific",
          userIds: taskInfo.assigned_employee_ids.map((emp) => String(emp.id)),
          message: `${
            isResource ? "New resource uploaded" : "New test report uploaded"
          }`,
          name: user.name.trim(),
          date: format(new Date(), "MM-dd-yyyy"),
          path: `/task-details/${id}`,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        toast.error("Failed to send notification.");
      }
      setFiles([]);
      setUploadState("idle");
      await fetchTaskById();
      fetchTasks();
      toast.success("Files uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload files. Please try again.");
    }
  };

  const renderContent = () => {
    switch (uploadState) {
      case "idle":
        return (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "text-gray-500 hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">📤</div>
              <p>Drag and drop your documents here,</p>
              <p>or click to select files.</p>
            </div>
          </label>
        );
      case "uploading":
        return <UploadingView />;
      case "uploaded":
        return (
          <UploadedView
            files={files}
            handleRemove={handleRemove}
            dragActive={dragActive}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-md p-6  space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upload Your Documents</h2>
      </div>
      <p className="text-sm text-gray-500">
        Supported formats: PDF, DOCX, XLSX, PNG, JPG.
      </p>

      {renderContent()}

      <div className="w-full justify-end flex">
        <div
          className={`w-[20%] flex justify-center items-center py-2 rounded mt-4 transition ${
            uploadState === "uploaded"
              ? "bg-[#004368] text-white hover:bg-[#003357] cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={uploadState !== "uploaded"}
          onClick={handleSubmit}
        >
          Submit
        </div>
      </div>
    </div>
  );
}
