import React from "react";

const PermissionModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl w-[90%] sm:w-[400px] p-6 relative border border-gray-200 transition-transform transform scale-100 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✖
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <div className="text-5xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don’t have permission to access this system.
          </p>
          <button
            onClick={onClose}
            className="bg-[#004368] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
