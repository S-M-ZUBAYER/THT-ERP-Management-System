import React from "react";
import AttendanceTableRow from "./AttendanceTableRow";

const AttendanceTable = ({
  records,
  selectedIds,
  onSelectAll,
  onSelectOne,
}) => {
  const allSelected =
    records.length > 0 && records.every((r) => selectedIds.includes(r.id));
  const someSelected =
    records.some((r) => selectedIds.includes(r.id)) && !allSelected;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={() => onSelectAll(records)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Package</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Payment Time</th>
            <th className="px-4 py-3">Expire Time</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map((record) => (
            <AttendanceTableRow
              key={record.id}
              record={record}
              isSelected={selectedIds.includes(record.id)}
              onSelect={onSelectOne}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
