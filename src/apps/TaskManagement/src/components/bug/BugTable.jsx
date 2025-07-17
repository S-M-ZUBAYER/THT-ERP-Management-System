import { useMemo, useState } from "react";

// import { useBugData } from "@/hook/useBugData";
import BugTableRow from "./BugTableRow";
// import icons from "@/constants/icons";
import CustomPagination from "../Pagination";
import icons from "../../constants/icons";
import { useBugData } from "../../hook/useBugData";

const ITEMS_PER_PAGE = 10;

export default function BugTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { bugs } = useBugData();
  const totalPages = Math.ceil(bugs.length / ITEMS_PER_PAGE);

  const paginatedBugs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return bugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, bugs]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="overflow-x-auto rounded-lg  ">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className=" text-[#004368] text-sm ">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 ">
              <div className="flex items-center gap-2">
                <img src={icons.Event} alt="icon" className="w-4 h-4" />
                <p>Find date</p>
              </div>
            </th>
            <th className="px-4 py-3 ">
              <div className="flex items-center gap-2">
                <img src={icons.Event} alt="icon" className="w-4 h-4" />
                <p>Solve date</p>
              </div>
            </th>
            <th className="px-4 py-3">Solved by</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Attachments</th>
            <th className="px-4 py-3 pl-7">Status</th>
            <th className="px-4 py-3 pl-7">Remark</th>
          </tr>
        </thead>
        <tbody>
          {bugs === null ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No bugs found.
              </td>
            </tr>
          ) : (
            paginatedBugs.map((bug) => <BugTableRow key={bug.id} bug={bug} />)
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-6">
        <CustomPagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
