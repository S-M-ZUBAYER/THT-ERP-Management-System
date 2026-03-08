// RefreshButton.jsx
import React from "react";

const RefreshButton = ({ onRefresh, loading }) => (
  <div className="mb-4 flex justify-end">
    <button
      onClick={onRefresh}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Refreshing...
        </>
      ) : (
        "↻ Refresh Employee Data"
      )}
    </button>
  </div>
);

export default RefreshButton;
