import React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export const TaskCard = ({ task }) => {
  const {
    task_title,
    task_details,
    task_deadline,
    assigned_employee_ids = [],
  } = task.taskInfo || {};

  return (
    <div className="border border-[#ded8fc] rounded-xl p-[2vw] w-full max-w-[440px] h-[25vh] bg-white hover:shadow-md transition-all">
      <span className="text-[10px] text-[#925FE2] font-semibold uppercase mb-2 block">
        ● Project
      </span>

      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">
        {task_title || "Untitled Task"}
      </h3>

      <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-5">
        {task_details || "No task details provided."}
      </p>

      {task_deadline && (
        <div className="text-xs text-red-500 flex items-center gap-1 mb-2">
          <CalendarDays size={14} className="text-red-500" />
          <span>
            Deadline: {format(new Date(task_deadline), "MMMM d, yyyy")}
          </span>
        </div>
      )}

      <div className="flex gap-1">
        {assigned_employee_ids.map(({ image }, i) =>
          image ? (
            <img
              key={i}
              src={image}
              alt={`Employee ${i + 1}`}
              className="w-6 h-6 rounded-full border-2 border-white -ml-1"
            />
          ) : null
        )}
      </div>
    </div>
  );
};
