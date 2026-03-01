// EmployeeCard.jsx
import React from "react";

const MEDIA_URL =
  "https://grozziie.zjweiting.com:3091/grozziie-attendance-debug/media";

const EmployeeCard = ({ employee, onSelect, cleanName }) => (
  <div
    onClick={() => onSelect(employee)}
    className={`text-center border rounded-lg p-4 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md
      ${employee.isLeader ? "bg-blue-50 border-blue-300" : "bg-white"}`}
  >
    <div className="w-14 h-14 mx-auto mb-2">
      <img
        src={
          employee.imageFile
            ? `${MEDIA_URL}/${employee.imageFile}`
            : "/avatar.png"
        }
        alt={employee.name}
        className="w-full h-full rounded-full object-cover border border-gray-200"
        onError={(e) => {
          e.target.src = "/avatar.png";
        }}
      />
    </div>
    <p className="font-medium text-sm text-gray-800">
      {cleanName(employee.name)}
    </p>
    {employee.isLeader && (
      <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full font-semibold">
        Leader
      </span>
    )}
  </div>
);

export default EmployeeCard;
