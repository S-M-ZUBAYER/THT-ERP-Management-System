import React, { useState } from "react";
import { Download, Loader2, Calendar } from "lucide-react";
import {
  exportToExcelDatewiseAllDataForFirstPage,
  exportToExcelDatewiseForFirstPage,
} from "../utils/excelDatewiseCountExportFirstPage";

const DeviceEmployeeExport = () => {
  const [allDeviceCount, setAllDeviceCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allDataloading, setAllDataLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      start: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      end: formatDate(today),
    };
  });

 const fetchAllDevices = async (startDate, endDate, pageSize = 20) => {
   setError("");
   setAllDeviceCount([]);

   try {
     // Fetch page 0 (first page)
     const firstResponse = await fetch(
       `https://grozziie.zjweiting.com:3091/grozziie-attendance-debug/api/dev/administration/device-employee-added/between/paginated?startDate=${startDate}&endDate=${endDate}&page=0&size=${pageSize}`,
     );

     if (!firstResponse.ok) {
       throw new Error(`HTTP error! status: ${firstResponse.status}`);
     }

     const firstData = await firstResponse.json();
     const totalPages = firstData.totalPages;

     let allDevices = [...firstData.devices];
     setProgress({ current: 1, total: totalPages });

     // If there's only 1 page, return immediately
     if (totalPages <= 1) {
       setAllDeviceCount(allDevices);
       return { devices: allDevices, totalDevices: firstData.totalDevices };
     }

     // Start fetching from page 1 (second page)
     const promises = [];
     for (let page = 1; page < totalPages; page++) {
       promises.push(
         fetch(
           `https://grozziie.zjweiting.com:3091/grozziie-attendance-debug/api/dev/administration/device-employee-added/between/paginated?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${pageSize}`,
         ).then((res) => {
           if (!res.ok) {
             throw new Error(`HTTP error! status: ${res.status}`);
           }
           return res.json();
         }),
       );
     }

     const results = await Promise.all(promises);

     results.forEach((data, index) => {
       allDevices = [...allDevices, ...data.devices];
       setProgress({ current: index + 2, total: totalPages }); // +2 because: 1 for page 0, +1 for current index
     });

     setAllDeviceCount(allDevices);
     return { devices: allDevices, totalDevices: firstData.totalDevices };
   } catch (err) {
     setError(`Error fetching data: ${err.message}`);
     return null;
   }
 };
  const handleFetchAndExportCount = async () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setDateRange({ start: startDate, end: endDate });

    try {
      const result = await fetchAllDevices(startDate, endDate);

      if (result?.devices?.length) {
        await exportToExcelDatewiseForFirstPage(
          result.devices,
          startDate,
          endDate,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAndExportAllData = async () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setAllDataLoading(true);
    setDateRange({ start: startDate, end: endDate });

    try {
      const result = await fetchAllDevices(startDate, endDate);

      if (result?.devices?.length) {
        await exportToExcelDatewiseAllDataForFirstPage(
          result.devices,
          startDate,
          endDate,
        );
      }
    } finally {
      setAllDataLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Device Employee Report Export
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 bg-white">
          <div>
            <label className="block text-sm font-medium bg-white text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  start: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium bg-white text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  end: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleFetchAndExportCount}
          disabled={loading}
          className="w-full bg-[#03c133] hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Fetching data...
            </>
          ) : (
            <>
              <Download size={20} />
              Fetch & Export to Excel Only Count
            </>
          )}
        </button>

        <button
          onClick={handleFetchAndExportAllData}
          disabled={allDataloading}
          className="w-full bg-[#004368] hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {allDataloading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Fetching data...
            </>
          ) : (
            <>
              <Download size={20} />
              Fetch & Export to Excel All Data
            </>
          )}
        </button>

        {loading && progress.total > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">
                Fetching pages...
              </span>
              <span className="text-sm font-medium text-blue-700">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {allDeviceCount.length > 0 && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ✓ Data fetched successfully!
            </h3>
            <p className="text-green-700 text-sm">
              Total devices loaded: {allDeviceCount.length}
            </p>
            <p className="text-green-700 text-sm">
              Total employees:{" "}
              {allDeviceCount.reduce((sum, d) => sum + d.employeeCount, 0)}
            </p>
          </div>
        )}

        {dateRange.start && dateRange.end && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-2">
            <Calendar size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Selected Range: {dateRange.start} to {dateRange.end}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceEmployeeExport;
