import React, { useState, useMemo } from "react";
// import ProjectTaskCard from "@/components/alltask/ProjectTaskCard";
// import Loader from "@/components/Loader";
// import CustomPagination from "@/components/Pagination";
// import { useGetAllTaskData } from "@/hook/useGetAllTaskData";
import ProjectTaskCard from "../components/alltask/ProjectTaskCard";
import Loader from "../components/Loader";
import CustomPagination from "../components/Pagination";
import { useGetAllTaskData } from "../hook/useGetAllTaskData";

const ITEMS_PER_PAGE = 12;

const AllTask = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { allTask, loading } = useGetAllTaskData();
  const totalPages = Math.ceil(allTask.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allTask.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, allTask]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="w-[80vw] px-6 py-8 mx-auto">
      {loading ? (
        <div className="w-[75vw] h-[67vh] flex justify-center items-center ">
          <Loader />
        </div>
      ) : allTask.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
            {paginatedTasks.map((data, index) => (
              <ProjectTaskCard key={index} task={data} />
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <CustomPagination
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default AllTask;
