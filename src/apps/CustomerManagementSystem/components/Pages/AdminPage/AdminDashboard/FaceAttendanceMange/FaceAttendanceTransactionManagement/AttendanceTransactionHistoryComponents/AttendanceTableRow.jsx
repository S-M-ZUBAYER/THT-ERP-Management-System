import React from "react";

const AttendanceTableRow = ({ record, isSelected, onSelect }) => {
  const amount = parseFloat(record.amount || 0);
  const isPaid = amount > 0;
  const isActive = record.paymentStatus === 1;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(record.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 font-medium">{record.id}</td>
      <td className="px-4 py-3 font-semibold text-gray-800">{record.email}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
          {record.package_name}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`font-bold ${isPaid ? "text-green-600" : "text-gray-400"}`}
        >
          ${amount.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-3 uppercase text-gray-600">{record.currency}</td>
      <td className="px-4 py-3 text-gray-500 text-xs">
        {new Date(record.paymentTime).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs">
        {new Date(record.paymentExpireTime).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
};

export default AttendanceTableRow;
