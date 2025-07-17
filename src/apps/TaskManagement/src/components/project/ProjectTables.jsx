import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useUserData } from "../../hook/useUserData";
import { useState, useMemo } from "react";
import CustomPagination from "../Pagination";
import AddProject from "./AddProject";

const ITEMS_PER_PAGE = 10;

export const ProjectTables = ({ Data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { admin } = useUserData();
  const navigate = useNavigate();

  const totalPages = Math.ceil(Data.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return Data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, Data]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTaskDetails = (projectName) => {
    navigate(`/task-management/tasks/${projectName}`);
  };
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold mb-4 text-[#1A1A1A]">
          All Project
        </h3>
        {admin && <AddProject />}
      </div>
      <div className="overflow-auto bg-[#FDFBFF] rounded-lg ">
        <table className="w-full text-sm  text-center">
          <thead className="text-muted-foreground border-b">
            <tr className="text-[#004368]">
              <th className="p-2 text-left">Name</th>
              <th>
                <div className="flex text-[#004368] justify-center items-center gap-1.5">
                  <Calendar className="w-4 h-4 " />
                  <p>Start date</p>
                </div>
              </th>
              <th>
                <div className="flex text-[#004368] justify-center items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <p>End Date</p>
                </div>
              </th>
              <th className="p-2">Assigned on</th>
              <th className="p-2">Resources</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedTasks) && paginatedTasks.length > 0 ? (
              paginatedTasks.map((data) => {
                const { projectInfo } = data;
                return (
                  <tr
                    key={projectInfo.id}
                    className="border-b cursor-pointer"
                    onClick={() => handleTaskDetails(projectInfo.project_name)}
                  >
                    <td className="p-2 text-left">
                      {projectInfo.project_name}
                    </td>

                    <td className="p-2">
                      {format(
                        new Date(projectInfo.project_startDate),
                        "yyyy-MM-dd"
                      )}
                    </td>

                    <td className="pl-5">
                      {format(
                        new Date(projectInfo.project_endDate),
                        "yyyy-MM-dd"
                      )}
                    </td>

                    <td className="flex justify-center items-center p-2">
                      <div className="flex">
                        {Array.isArray(projectInfo.assign_with_ids) &&
                          projectInfo.assign_with_ids.map(({ image }, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt="Employee"
                              className="w-6 h-6 rounded-full border-2 border-white -ml-1"
                            />
                          ))}
                      </div>
                    </td>

                    <td className="p-2">Resources</td>

                    <td className="p-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {projectInfo.project_status}
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
                    "No Projects available. Please add a project."
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
