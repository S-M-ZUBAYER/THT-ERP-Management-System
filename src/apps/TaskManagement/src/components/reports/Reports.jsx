import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTaskReports } from "../../hook/useTaskReports";
import { ReportDateRangePicker } from "../ReportDatePicker";
import icons from "../../constants/icons";
// import icons from "@/constants/icons";

const Reports = () => {
  const { email, name } = useParams();
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const { allData, loading, error } = useTaskReports(email);

  const filteredData =
    dateRange.from && dateRange.to
      ? allData.filter((report) => {
          const createdTime = new Date(report.createdTime);

          const startDate = new Date(dateRange.from);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);

          return createdTime >= startDate && createdTime <= endDate;
        })
      : allData;

  return (
    <div className="p-8 bg-white min-h-screen w-[80vw]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8 mb-6">
          <div
            className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
            onClick={() => window.history.back()}
          >
            <img src={icons.Back} alt="Back" className="w-5 h-5" />
          </div>
          <h2 className="text-[22px] sm:text-[25px] font-normal text-gray-800 flex flex-wrap items-baseline gap-1">
            <span>Task Report of</span>
            <span className="text-[#004368] font-semibold">{name}</span>
          </h2>
        </div>

        <div className="mb-10">
          <div>
            <ReportDateRangePicker onRangeSelect={setDateRange} />
          </div>
        </div>
      </div>

      {loading && <p>Loading reports...</p>}
      {allData.length === 0 && <p>No Task Report</p>}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-gray-500">No reports found for this date range.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((report) => (
          <div
            key={report.id}
            className="border p-4 shadow-sm border-[#F0E6FF] rounded-[8px] flex flex-col justify-between hover:shadow-md transition-all duration-200"
          >
            <ul className="text-sm list-decimal pl-5">
              <p className="break-words whitespace-pre-line max-w-full">
                {report.reportDetails}
              </p>
            </ul>
            <div className="mt-2 text-sm text-[#004368] flex gap-1.5 items-center justify-end">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M12 1.5V4.5M6 1.5V4.5"
                    stroke="#004368"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 3H8.25C5.42157 3 4.00736 3 3.12868 3.87868C2.25 4.75736 2.25 6.17157 2.25 9V10.5C2.25 13.3284 2.25 14.7427 3.12868 15.6213C4.00736 16.5 5.42157 16.5 8.25 16.5H9.75C12.5784 16.5 13.9927 16.5 14.8713 15.6213C15.75 14.7427 15.75 13.3284 15.75 10.5V9C15.75 6.17157 15.75 4.75736 14.8713 3.87868C13.9927 3 12.5784 3 9.75 3Z"
                    stroke="#004368"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.25 7.5H15.75"
                    stroke="#004368"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.25 10.5H12M6 10.5H6.00673M9.75 13.5H6M12 13.5H11.9933"
                    stroke="#B0C5D0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p>{new Date(report.createdTime).toDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
