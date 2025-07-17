// import TodaysTaskReports from "@/components/task-report/TodaysTaskReports";
// import AllTaskReports from "@/components/task-report/AllTaskReports";

import AllTaskReports from "../components/task-report/AllTaskReports";
import TodaysTaskReports from "../components/task-report/TodaysTaskReports";

export default function TaskReport() {
  return (
    <div className="p-4 lg:p-8">
      <TodaysTaskReports />
      <AllTaskReports />
    </div>
  );
}
