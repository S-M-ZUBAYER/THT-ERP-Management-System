import React from "react";

export const PaginationControls = ({
  pagination,
  onPageChange,
  itemLabel = "questions",
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, hasPrevPage, hasNextPage, total, limit } =
    pagination;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(
      (pageNumber) =>
        pageNumber === 1 ||
        pageNumber === totalPages ||
        Math.abs(pageNumber - page) <= 1,
    );
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-medium text-gray-600">
        Showing {startItem}-{endItem} of {total} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          Prev
        </button>

        {pageNumbers.map((pageNumber, index) => {
          const previousPage = pageNumbers[index - 1];
          const showGap = previousPage && pageNumber - previousPage > 1;

          return (
            <React.Fragment key={pageNumber}>
              {showGap && <span className="px-1 text-gray-400">...</span>}
              <button
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  pageNumber === page
                    ? "bg-[#004368] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </React.Fragment>
          );
        })}

        <button
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};


export const ConfirmActionModal = ({
  title,
  message,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onCancel,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-xl max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="p-6">
        <p className="text-gray-700">{message}</p>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
        <button
          className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmClassName}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);


export const EmptyState = () => (
  <div className="text-center py-12 bg-white rounded-lg shadow">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Unknown Questions
    </h3>
    <p className="text-gray-500">
      There are no unknown questions to display at this time.
    </p>
  </div>
);


export const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600 mb-4"></div>
    <p className="text-gray-600">Loading questions...</p>
  </div>
);


export const ErrorMessage = ({ message }) => (
  <div className="text-center py-12 bg-red-50 rounded-lg">
    <div className="text-6xl mb-4">⚠️</div>
    <p className="text-red-600 mb-4">{message}</p>
  </div>
);


