import React from "react";
import TaskCard from "./TaskCard";
import icons from "../../constants/icons";
// import icons from "@/constants/icons";

const columnData = [
  {
    title: "To Do",
    bg: "bg-[#F5ECFF]",
    text: "text-[#7027A0]",
    icon: icons.ToDo,
    filter:
      "invert(16%) sepia(88%) saturate(6361%) hue-rotate(258deg) brightness(100%) contrast(101%)",
  },
  {
    title: "In Progress",
    bg: "bg-[#FFF4E6]",
    text: "text-[#FF8C00]",
    icon: icons.TaskProgress,
    filter:
      "invert(18%) sepia(95%) saturate(5661%) hue-rotate(1deg) brightness(103%) contrast(102%)",
  },
  {
    title: "Completed",
    bg: "bg-[#E6FFFA]",
    text: "text-[#2ECC71]",
    icon: icons.TaskDone,
    filter:
      "invert(43%) sepia(86%) saturate(2832%) hue-rotate(95deg) brightness(97%) contrast(102%)",
  },
];

const TaskColumn = ({ index, tasks }) => {
  const { title, bg, text, icon, filter } = columnData[index];
  return (
    <div className="space-y-4 shadow-sm p-5 rounded-xl">
      <div className={`p-4 rounded-xl ${bg} ${text}`}>
        <div className="text-md font-[400] flex items-center gap-2">
          <img src={icon} alt={title} className="w-5 h-5" style={{ filter }} />
          <p>{title}</p>
        </div>
      </div>
      {tasks.map((task, i) => (
        <TaskCard
          key={i}
          title={task.title}
          description={task.description}
          dateLabel={index === 2 ? "Completed" : "Deadline"}
          date={index === 2 ? task.completed : task.deadline}
          statusIndex={index}
          employees={task.employees}
          id={task.id}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
