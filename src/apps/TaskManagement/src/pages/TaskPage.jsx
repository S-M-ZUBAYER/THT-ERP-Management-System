// import { TaskListTable } from "@/components/task/TaskListTable";
// import { CalendarPanel } from "@/components/task/CalendarPanel";
// import { ResourcesPanel } from "@/components/ResourcesPanel";
// import TaskCardProvider from "@/components/task/TaskCardProvider";
// import { useProjectTaskData } from "@/hook/useProjectTaskData";

import { ResourcesPanel } from "../components/ResourcesPanel";
import { CalendarPanel } from "../components/task/CalendarPanel";
import TaskCardProvider from "../components/task/TaskCardProvider";
import { TaskListTable } from "../components/task/TaskListTable";
import { useProjectTaskData } from "../hook/useProjectTaskData";

export default function TaskPage() {
  const { tasks, isLoading } = useProjectTaskData();
  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 px-[5vw] w-[80vw] ">
      <div className="col-span-2">
        <TaskCardProvider task={tasks} />

        <div className="mt-6">
          <TaskListTable taskData={tasks} loading={isLoading} />
        </div>
      </div>
      <div className="space-y-6">
        <CalendarPanel />
        <ResourcesPanel task={tasks} />
      </div>
    </div>
  );
}
