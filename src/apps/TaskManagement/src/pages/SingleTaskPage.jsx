import { useEffect } from "react";
// import { useTaskStore } from "@/Zustand/useTaskStore";
import useTaskData from "../hook/useTaskData";

// import TaskHeader from "@/components/task details/TaskHeader";

// import TaskDetails from "@/components/task details/TaskDetails";
// import DiscussionList from "@/components/task details/DiscussionList";
// import ResourceList from "@/components/task details/ResourceList";
// import TaskStatus from "@/components/task details/TaskStatus";
// import AssignedUsers from "@/components/task details/AssignedUsers";

// import { Clock } from "@/components/svg/svg";
import { format } from "date-fns";
// import Loader from "@/components/Loader";
import Loader from "../components/Loader";
import { Clock } from "../components/svg/svg";
import { useTaskStore } from "../Zustand/useTaskStore";
import TaskHeader from "../components/task details/TaskHeader";
import TaskDetails from "../components/task details/TaskDetails";
import DiscussionList from "../components/task details/DiscussionList";
import ResourceList from "../components/task details/ResourceList";
import TaskStatus from "../components/task details/TaskStatus";
import AssignedUsers from "../components/task details/AssignedUsers";

const SingleTaskPage = () => {
  const { task } = useTaskStore();
  const { id, fetchTaskById, loading } = useTaskData();

  useEffect(() => {
    if (!task && id) fetchTaskById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-[80vw] ">
        <Loader />
      </div>
    );
  }
  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen w-[80vw] ">
        <p className="text-gray-500">No task found.</p>
      </div>
    );
  }

  const { taskInfo, discussions, testReports, resourceFiles } = task;

  return (
    <div className="w-[80vw] px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TaskHeader TaskHeader={taskInfo.task_title} />
          <TaskDetails TaskDetail={taskInfo.task_details} />
          <div>
            <h3 className="font-semibold mb-2 text-[#004368]">Time</h3>
            <div className="text-sm text-gray-600 flex gap-4">
              <div className="flex items-center gap-2">
                <Clock Stock="#202020" />
                <p className="text-[#202020]">
                  Start date:{" "}
                  {format(taskInfo.task_starting_time, "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock Stock="#FF0000" />
                <p className="text-[#FF0000]">
                  Deadline:{" "}
                  {taskInfo.task_deadline !== null
                    ? format(taskInfo.task_deadline, "MMMM d, yyyy")
                    : "Not started yet"}
                </p>
              </div>
            </div>
          </div>
          <AssignedUsers assign={taskInfo.assigned_employee_ids} />
          <TaskStatus
            current={taskInfo.status}
            assign={taskInfo.assigned_employee_ids}
          />
          <DiscussionList discussions={discussions} />
        </div>

        <div className="space-y-6">
          <ResourceList title="Resources" items={resourceFiles} />
          <ResourceList title="Test Reports Documents" items={testReports} />
        </div>
      </div>
    </div>
  );
};

export default SingleTaskPage;
