// ExportButtons.jsx
import React from "react";

const ExportButtons = ({
  onExportAll,
  onExportDatewise,
  loading,
  showDatePicker,
  setShowDatePicker,
}) => (
  <div className="mt-10 pt-8 border-t border-gray-300">
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
      {/* Excel All History Button */}
      <button
        onClick={onExportAll}
        disabled={loading.allHistory}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-3 shadow-md hover:shadow-lg"
      >
        {loading.allHistory ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Exporting...
          </>
        ) : (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export All Device History
          </>
        )}
      </button>

      {/* Excel Datewise Count Button */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          disabled={loading.datewise}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-3 shadow-md hover:shadow-lg"
        >
          {loading.datewise ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Export Datewise Count
            </>
          )}
        </button>
      </div>
    </div>

    {/* Instructions */}
    <div className="mt-6 text-center text-sm text-gray-600 max-w-3xl mx-auto">
      <p className="mb-2">
        <span className="font-semibold">Excel All Device History:</span> Exports
        complete history for all devices with employee records.
      </p>
      <p>
        <span className="font-semibold">Excel Datewise Count:</span> Exports a
        summary table showing unique employee counts according to the device per
        date for each device.
      </p>
    </div>
  </div>
);

export default ExportButtons;
