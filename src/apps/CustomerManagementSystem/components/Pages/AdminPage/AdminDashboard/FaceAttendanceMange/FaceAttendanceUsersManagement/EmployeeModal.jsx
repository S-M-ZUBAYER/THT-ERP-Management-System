// EmployeeModal.jsx
import React from "react";

const MEDIA_URL =
  "https://grozziie.zjweiting.com:3091/grozziie-attendance-debug/media";

const EmployeeModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 🖼 Image */}
        <div className="flex justify-center">
          <img
            src={
              employee.imageFile
                ? `${MEDIA_URL}/${employee.imageFile}`
                : "/avatar.png"
            }
            alt={employee.name}
            className="w-72 h-72 rounded-xl object-cover shadow-lg border"
            onError={(e) => (e.target.src = "/avatar.png")}
          />
        </div>

        {/* 👤 Employee Info */}
        <div className="mt-5 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {employee.name}
          </h3>

          {employee.isLeader && (
            <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">
              Leader
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
