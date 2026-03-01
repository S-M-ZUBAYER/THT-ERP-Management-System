// Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex justify-between items-center mb-4 text-gray-700">
    <button
      onClick={onPrev}
      disabled={currentPage === 0}
      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      &larr; Prev
    </button>
    <span className="text-sm font-medium">
      Page {currentPage + 1} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages - 1}
      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Next &rarr;
    </button>
  </div>
);

export default Pagination;
