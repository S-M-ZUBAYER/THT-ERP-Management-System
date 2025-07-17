import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// import icons from "@/constants/icons";
// import { axiosApi } from "@/lib/axiosApi";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "../ui/alert-dialog";
import { useState } from "react";
// import { useGetAllTaskData } from "@/hook/useGetAllTaskData";
import { Edit2 } from "lucide-react";
// import { useProjectUpdateStore } from "@/Zustand/useProjectUpdateStore";
// import useTaskColumns from "@/hook/useTasksData";
// import { useGetAllProjectData } from "@/hook/useGetAllprojectData";
import { useProjectUpdateStore } from "../../Zustand/useProjectUpdateStore";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import { useGetAllTaskData } from "../../hook/useGetAllTaskData";
import useTaskColumns from "../../hook/useTasksData";
import { useGetAllProjectData } from "../../hook/useGetAllprojectData";

function ProjectTaskMenu({ id, task }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { GetAllTaskfetchTasks } = useGetAllTaskData();
  const { setShowUpdateModal, setProjectDetails } = useProjectUpdateStore();
  const { fetchTasks } = useTaskColumns();
  const { refetch } = useGetAllProjectData();
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await axiosApi.post(`/projects/delete/${id}`);
      toast.success("Project deleted successfully");
      GetAllTaskfetchTasks();
      fetchTasks();
      refetch();
    } catch (error) {
      console.error("Error deleting Project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          style={{
            backgroundColor: "transparent",
            height: "auto",
            fontWeight: "normal",
            outline: "none",
            border: "none",
            padding: "0",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M14.625 10.125C15.2463 10.125 15.75 9.6213 15.75 9C15.75 8.3787 15.2463 7.875 14.625 7.875C14.0037 7.875 13.5 8.3787 13.5 9C13.5 9.6213 14.0037 10.125 14.625 10.125Z"
              stroke="#004368"
            />
            <path
              d="M9 10.125C9.6213 10.125 10.125 9.6213 10.125 9C10.125 8.3787 9.6213 7.875 9 7.875C8.3787 7.875 7.875 8.3787 7.875 9C7.875 9.6213 8.3787 10.125 9 10.125Z"
              stroke="#B0C5D0"
            />
            <path
              d="M3.375 10.125C3.9963 10.125 4.5 9.6213 4.5 9C4.5 8.3787 3.9963 7.875 3.375 7.875C2.7537 7.875 2.25 8.3787 2.25 9C2.25 9.6213 2.7537 10.125 3.375 10.125Z"
              stroke="#004368"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <div
              className="flex items-center text-[#004368] "
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
            >
              <img src={icons.Delete} alt="Edit" className="w-4 h-4 mr-2" />
              <p>Delete Project</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="flex items-center text-[#004368] "
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdateModal(true);
                setProjectDetails(task);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              <p>Edit Project</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div onClick={(e) => e.stopPropagation()} className="hidden">
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogPortal>
            <AlertDialogOverlay
              forceMount
              className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm bg-opacity-50"
              style={{ shadow: "none" }}
            />

            <AlertDialogContent
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center rounded-lg bg-white p-6 max-w-md mx-auto border-none"
            >
              <AlertDialogHeader className="flex flex-col items-center mb-4">
                <AlertDialogTitle className="flex flex-col items-center text-xl font-semibold text-gray-900">
                  <div className="w-10 h-10 bg-[#F8D7DA] rounded-full flex items-center justify-center mb-2">
                    <img
                      src={icons.Alert || "https://i.pravatar.cc/150?img=dj"}
                      alt="Alert Icon"
                      className="w-10"
                    />
                  </div>
                  Delete project
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-500 text-center">
                  Are you sure want to delete this project account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-3 ">
                <AlertDialogCancel
                  className="px-4 py-2 text-[#004368] rounded-lg transition-colors ring-0 focus:outline-none border-none"
                  style={{ backgroundColor: "#D6E6F0", outline: "none" }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    handleDelete(e);
                  }}
                  className="px-4 py-2 text-[#DC3545] rounded-lg transition-colors"
                  style={{ backgroundColor: "#FFDEDE" }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      </div>
    </>
  );
}

export default ProjectTaskMenu;
