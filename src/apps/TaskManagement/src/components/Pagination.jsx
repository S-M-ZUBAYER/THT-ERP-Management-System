import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

function CustomPagination({ handlePageChange, currentPage, totalPages }) {
  return (
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
  );
}

export default CustomPagination;
