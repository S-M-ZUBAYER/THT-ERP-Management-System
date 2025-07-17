import React from "react";
// import { Clock } from "@/components/svg/svg";
import TaskMenu from "./TaskMenu";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hook/useUserData";
import { Clock } from "../svg/svg";

const statusColors = [
  {
    text: "text-[#7027A0]",
    border: "border-[#D1B3FF]",
    svgColor: "#7027A0",
  },
  {
    text: "text-[#FF8C00]",
    border: "border-[#FFD8A9]",
    svgColor: "#FF8C00",
  },
  {
    text: "text-[#2ECC71]",
    border: "border-[#A9FFD8]",
    svgColor: "#2ECC71",
  },
];

const TaskCard = ({
  title,
  description,
  dateLabel,
  date,
  statusIndex,
  employees,
  id,
}) => {
  const { text, svgColor } = statusColors[statusIndex];
  const navigate = useNavigate();
  const { admin } = useUserData();

  return (
    <div
      className="bg-white rounded-xl border-2 p-4 space-y-3 border-[#E8D9FF]"
      onClick={() => {
        navigate(`/task-management/task-details/${id}`);
      }}
    >
      <div className="text-xs text-purple-600 font-bold flex justify-between">
        <p>Project</p>
        {admin && statusIndex === 0 && <TaskMenu id={id} projectName={title} />}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-4">{description}</p>
      <div className={`text-sm font-medium flex items-center gap-1 ${text}`}>
        <Clock Stock={svgColor} />
        <p>
          {dateLabel}: {new Date(date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex -space-x-2">
        {employees.length > 0 ? (
          employees.map((emp, i) => (
            <img
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white"
              src={emp.image}
              alt={emp.name}
            />
          ))
        ) : (
          <p className="text-xs text-gray-400">No members</p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
