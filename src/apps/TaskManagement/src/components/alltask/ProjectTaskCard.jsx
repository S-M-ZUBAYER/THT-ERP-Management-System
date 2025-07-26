import React from "react";
import { useNavigate } from "react-router-dom";
import ProjectTaskMenu from "./ProjectTaskMenu";
import UpdateProject from "./UpdateProject";
import { useProjectUpdateStore } from "../../Zustand/useProjectUpdateStore";
import { useUserData } from "../../hook/useUserData";

const ProjectTaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { showUpdateModal } = useProjectUpdateStore();
  const handleBugClick = () => {
    navigate(`/task-management/tasks/${task.project_name}`);
  };
  return (
    <>
      <div
        className="border-2 border-[#E8D9FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-auto"
        onClick={handleBugClick}
      >
        <div>
          <div className=" flex justify-between items-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[#E8D9FF] rounded-full"></div>
              <p className="text-sm text-[#6600FF] font-medium">PROJECTS </p>
            </div>
            <div>
              {user.role === "Admin" && (
                <ProjectTaskMenu id={task.id} task={task} />
              )}
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-1 mt-6 break-words whitespace-pre-line max-w-full">
            {task.project_name}{" "}
          </h2>
          {task.tasks.length > 0 ? (
            <ul className="text-sm text-gray-700 list-decimal list-inside mb-4 line-clamp-4">
              {task.tasks.map(({ task_title }, index) => (
                <li key={index}>{task_title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No Data reported yet.</p>
          )}
        </div>
      </div>
      {showUpdateModal && <UpdateProject />}
    </>
  );
};

export default ProjectTaskCard;
