// DateRangePicker.jsx
import React from "react";

const DateRangePicker = ({
  show,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onExport,
  onCancel,
  loading,
}) => {
  if (!show) return null;

  return (
    <div className="absolute right-40 top-[75px] mt-2 bg-white rounded-lg shadow-xl p-6 border border-gray-300 z-10 min-w-[350px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Date Range
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onExport}
            disabled={!startDate || !endDate || loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Export
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          <p>• The export will include:</p>
          <p className="ml-2">- Device name and MAC</p>
          <p className="ml-2">- Total employee count per device</p>
          <p className="ml-2">- Unique employee count per date</p>
          <p className="ml-2">- Total attendance records</p>
          <p className="ml-2">- Summary with totals</p>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
