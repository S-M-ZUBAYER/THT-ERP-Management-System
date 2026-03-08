import React from "react";

const TransactionFilterBar = ({
  filterType,
  onFilterChange,
  selectedCount,
  totalCount,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter:</label>
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
        >
          <option value="all">All Transactions</option>
          <option value="paid">Paid Only</option>
          <option value="free">Free Only</option>
        </select>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            <span className="font-bold text-blue-600">{selectedCount}</span> of{" "}
            {totalCount} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default TransactionFilterBar;
