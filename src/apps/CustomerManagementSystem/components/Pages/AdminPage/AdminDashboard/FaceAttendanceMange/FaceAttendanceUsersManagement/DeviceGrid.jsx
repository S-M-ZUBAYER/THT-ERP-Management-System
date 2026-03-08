// DeviceGrid.jsx
import React from "react";
import DeviceCard from "./DeviceCard";

const DeviceGrid = ({ devices, selectedDevice, onSelectDevice }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
    {devices.map((device) => (
      <DeviceCard
        key={device.id}
        device={device}
        isSelected={selectedDevice?.id === device.id}
        onSelect={onSelectDevice}
      />
    ))}
  </div>
);

export default DeviceGrid;
