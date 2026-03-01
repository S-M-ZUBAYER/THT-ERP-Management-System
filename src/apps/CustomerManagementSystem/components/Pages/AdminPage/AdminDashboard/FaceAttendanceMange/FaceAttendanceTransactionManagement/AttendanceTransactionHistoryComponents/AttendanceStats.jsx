import React from "react";
import { calculateAttendanceRevenue } from "../AttendanceTransactionHistoryUtils/attendanceHelpers";

const AttendanceStats = ({ records }) => {
  const totalRevenue = calculateAttendanceRevenue(records);
  const paidRecords = records.filter((r) => parseFloat(r.amount) > 0).length;
  const freeRecords = records.length - paidRecords;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
        <p className="text-2xl font-bold text-gray-800">{records.length}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
        <p className="text-2xl font-bold text-green-600">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Paid Transactions</p>
        <p className="text-2xl font-bold text-blue-600">{paidRecords}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Free Transactions</p>
        <p className="text-2xl font-bold text-gray-600">{freeRecords}</p>
      </div>
    </div>
  );
};

export default AttendanceStats;
