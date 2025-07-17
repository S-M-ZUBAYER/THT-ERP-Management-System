// TaskCardProvider.jsx
import React, { useState, useMemo } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { TaskCard } from "./TaskCard";

const ITEMS_PER_PAGE = 2;

function TaskCardProvider({ task }) {
  const [currentPage, setCurrentPage] = useState(1);

  const progressTasks = useMemo(
    () => task.filter((t) => t.taskInfo.status === "In Progress"),
    [task]
  );

  const totalPages = Math.ceil(progressTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return progressTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, progressTasks]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="gap-4 border border-[#E6ECF0] rounded-xl pt-4 pb-2 px-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-[#004368] mb-3">In Progress</h2>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  style={{ color: "#004368" }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                    style={{ color: "#004368" }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 3 && currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  style={{ color: "#004368" }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <div className="flex gap-2">
        {paginatedTasks.map((task, idx) => (
          <TaskCard task={task} key={idx} />
        ))}
      </div>
    </div>
  );
}

export default TaskCardProvider;
