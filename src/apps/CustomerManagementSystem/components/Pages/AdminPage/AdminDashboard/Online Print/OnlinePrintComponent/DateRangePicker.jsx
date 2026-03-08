import React from "react";

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate, onExport, onCancel, loading, showDateRange }) => {
    if (!showDateRange) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">Select Date Range</h3>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onExport}
                            disabled={!startDate || !endDate || loading}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Exporting...
                                </div>
                            ) : (
                                "Export"
                            )}
                        </button>
                        <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                        <p className="font-medium mb-1">What will be exported:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Date-wise shop count summary</li>
                            <li>Total shops created in selected period</li>
                            <li>Daily breakdown of shop registrations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;