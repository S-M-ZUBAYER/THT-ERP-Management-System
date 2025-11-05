import React, { useEffect, useState } from "react";
import WebsiteCard from "./WebsiteCard";
import { ArrowLeft } from "lucide-react";

import wowomartLogo from "../../assets/WebsiteImages/wowmartDashboard.jpg";
import customerManagementLogo from "../../assets/WebsiteImages/customerManagement.jpg";
import exportImportLogo from "../../assets/WebsiteImages/exportImportLogo.jpg";
import taskManagementLogo from "../../assets/WebsiteImages/taskManagmentLogo.jpg";
import translatorLogo from "../../assets/WebsiteImages/translatorLogo.jpg";
import attendanceShiftingLogo from "../../assets/WebsiteImages/attendanceShiftingLogo.jpg";

const EmployeeSettings = ({ activeTab, selectedUser }) => {
  const [roles, setRoles] = useState({
    admin: false,
    leader: false,
    employee: false,
  });

  const [websites, setWebsites] = useState([
    {
      title: "THT-Customer Management System",
      image: customerManagementLogo,
      key: "thtManagement",
    },
    {
      title: "THT-Export-Import System",
      image: exportImportLogo,
      key: "ExportImportManagement",
    },
    {
      title: "THT-Task Management System",
      image: taskManagementLogo,
      key: "taskManagement",
    },
    {
      title: "THT-Wowomart Management System",
      image: wowomartLogo,
      key: "wowomartManagement",
    },
    {
      title: "THT-Translator System",
      image: translatorLogo,
      key: "translatorSystem",
    },
    {
      title: "THT-Attendance Shifting System",
      image: attendanceShiftingLogo,
      key: "attendanceSystem",
    },
  ]);

  useEffect(() => {
    if (selectedUser) {
      setRoles({
        admin: selectedUser.superAdmin === 1,
        leader: selectedUser.leader === 1,
        employee: selectedUser.superAdmin !== 1 && selectedUser.leader !== 1,
      });
    }
  }, [selectedUser]);

  const handleRouteNavigate = (site) => {
    console.log("Navigating to:", site.title);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow h-full">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-700">
          Settings {selectedUser ? `– ${selectedUser.name}` : ""}
        </h2>
      </div>

      {/* Roles */}
      <p className="text-gray-600 mb-2 font-medium">Employee Role</p>
      <div className="flex items-center gap-6 mb-6">
        {["admin", "leader", "employee"].map((key) => (
          <label key={key} className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={roles[key]}
              onChange={() =>
                setRoles((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      {/* Websites */}
      <h3 className="text-gray-700 font-semibold mb-3">Website Access</h3>
      <div className="grid grid-cols-2 gap-5">
        {websites.map((site, idx) => (
          <WebsiteCard
            key={idx}
            site={site}
            activeTab={activeTab}
            handleRouteNavigate={handleRouteNavigate}
            // ✅ Check which management system is enabled for selected user
            defaultEnabled={selectedUser && selectedUser[site.key] === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeSettings;
