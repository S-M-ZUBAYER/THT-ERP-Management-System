import { Calendar } from "lucide-react";
import AddTask from "./AddTask";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useUserData } from "../../hook/useUserData";
import { useState, useMemo } from "react";
import CustomPagination from "../Pagination";

const ITEMS_PER_PAGE = 10;

export const TaskListTable = ({ taskData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { admin } = useUserData();
  const navigate = useNavigate();

  const totalPages = Math.ceil(taskData.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return taskData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, taskData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTaskDetails = (taskId) => {
    navigate(`/task-management/task-details/${taskId}`);
  };
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold mb-4 text-[#1A1A1A]">All tasks</h3>
        {admin && <AddTask />}
      </div>
      <div className="overflow-auto bg-[#FDFBFF] rounded-lg">
        <table className="w-full text-sm text-center">
          <thead className="text-muted-foreground border-b">
            <tr className="text-[#004368]">
              <th className="p-2 text-left">Name</th>
              <th>
                <div className="flex justify-center items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <p>Start Date</p>
                </div>
              </th>
              <th>
                <div className="flex justify-center items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <p>End Date</p>
                </div>
              </th>
              <th className="p-2">Assigned On</th>
              <th className="p-2">Resources</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(paginatedTasks) && paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => {
                const { taskInfo } = task;

                return (
                  <tr
                    key={taskInfo.id}
                    className="border-b hover:bg-[#F4F2FB] transition cursor-pointer"
                    onClick={() => handleTaskDetails(taskInfo.id)}
                  >
                    <td className="p-2 text-left w-[6vw] ">
                      {taskInfo.task_title}
                    </td>

                    <td className="p-2">
                      {format(
                        new Date(taskInfo.task_starting_time),
                        "yyyy-MM-dd"
                      )}
                    </td>

                    <td className="p-2">
                      {format(new Date(taskInfo.task_deadline), "yyyy-MM-dd")}
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center items-center">
                        {Array.isArray(taskInfo.assigned_employee_ids) &&
                          taskInfo.assigned_employee_ids.map(
                            ({ image }, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt="Employee"
                                className="w-6 h-6 rounded-full border-2 border-white -ml-1 first:ml-0"
                              />
                            )
                          )}
                      </div>
                    </td>

                    <td className="p-2">Resources</td>

                    <td className="p-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {taskInfo.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  {loading ? (
                    <Loader />
                  ) : (
                    "No tasks available. Please add a task."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 space-x-2 text-sm text-gray-500">
        <CustomPagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};
