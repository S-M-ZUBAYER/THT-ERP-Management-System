// DeviceCard.jsx
import React from "react";

const DeviceCard = ({ device, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(device)}
    className={`p-4 rounded-xl cursor-pointer border transition relative
      ${isSelected ? "bg-[#004368] text-white" : "bg-white hover:bg-gray-50"}
      ${device.isLoading ? "opacity-60 cursor-wait" : ""}`}
  >
    {/* Loading indicator for individual device */}
    {device.isLoading && (
      <div className="absolute top-2 right-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
    )}

    <h3 className="font-semibold">{device.deviceName}</h3>
    <p className="text-sm">MAC: {device.deviceMAC}</p>
    <p className="text-sm">Created: {device.createdAt}</p>
    <p
      className={`mt-2 text-sm font-medium ${
        isSelected ? "text-white" : "text-gray-600"
      }`}
    >
      Employees:{" "}
      {device.isLoading ? (
        <span className="text-blue-500">Loading...</span>
      ) : device.employeeCount > 0 ? (
        device.employeeCount
      ) : (
        0
      )}
    </p>
  </div>
);

export default DeviceCard;
