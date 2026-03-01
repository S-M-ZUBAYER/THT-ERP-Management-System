import React, { useEffect, useState } from "react";
import WebsiteCard from "./WebsiteCard";
import { ArrowLeft } from "lucide-react";

import wowomartLogo from "../../assets/WebsiteImages/wowmartDashboard.jpg";
import customerManagementLogo from "../../assets/WebsiteImages/customerManagement.jpg";
import exportImportLogo from "../../assets/WebsiteImages/exportImportLogo.jpg";
import taskManagementLogo from "../../assets/WebsiteImages/taskManagmentLogo.jpg";
import translatorLogo from "../../assets/WebsiteImages/translatorLogo.jpg";
import attendanceShiftingLogo from "../../assets/WebsiteImages/attendanceShiftingLogo.jpg";
import { useNavigate } from "react-router-dom";
import PermissionModal from "../DashboardPage/PermissionModal";
import RoleSelector from "./RoleSelector";
import axios from "axios";
import toast from "react-hot-toast";

const EmployeeSettings = ({
  activeTab,
  selectedUser,
  currentUser,
  setSelectedUser,
  setUserData,
}) => {
  const navigate = useNavigate();
  const [accessModal, setAccessModal] = useState(false);
  const [roles, setRoles] = useState({
    admin: false,
    leader: false,
    employee: false,
  });

  const [confirmModal, setConfirmModal] = useState({ show: false, role: null });
  const [loading, setLoading] = useState(false);

  const handleCheckboxClick = (key) => {
    if (key === "employee") return; // can't change employee
    if (currentUser?.superAdmin === 1) {
      setConfirmModal({ show: true, role: key });
    }
  };

  const handleUpdateRole = async (role) => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      const field = role === "admin" ? "superAdmin" : "leader";
      const currentValue = selectedUser?.[field];
      const newValue = currentValue === 1 ? 0 : 1;

      const endpoint =
        role === "admin"
          ? `https://grozziieget.zjweiting.com:8033/tht/users/update/superAdmin/${selectedUser.id}`
          : `https://grozziieget.zjweiting.com:8033/tht/users/update/leader/${selectedUser.id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (res.ok) {
        toast.success(
          `${selectedUser.name} has been ${
            newValue === 1 ? "granted" : "removed from"
          } ${role} role.`,
        );

        // ✅ Update selectedUser locally
        const updatedUser = { ...selectedUser, [field]: newValue };

        if (currentUser && currentUser.email === updatedUser.email) {
          const updatedCurrentUser = { ...currentUser, ...updatedUser };
          localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        }

        // ✅ Recalculate which category the user now belongs to
        let newCategory = "employee";
        if (updatedUser.superAdmin === 1) newCategory = "admin";
        else if (updatedUser.leader === 1) newCategory = "leader";

        setUserData((prev) => {
          const updated = {
            admin: prev.admin.filter((u) => u.id !== updatedUser.id),
            leader: prev.leader.filter((u) => u.id !== updatedUser.id),
            employee: prev.employee.filter((u) => u.id !== updatedUser.id),
          };

          // ✅ Push into correct category
          updated[newCategory].unshift(updatedUser);
          return updated;
        });

        // ✅ Update selected user
        setSelectedUser(updatedUser);
        setConfirmModal({ show: false, role: null });
      } else {
        toast.error(`Failed to update ${role} status.`);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Something went wrong while updating role.");
    } finally {
      setLoading(false);
    }
  };

  const [websites, setWebsites] = useState([
    {
      title: "THT-Customer Management System",
      image: customerManagementLogo,
      route: "/customer-management-system",
      key: "thtManagement",
    },
    {
      title: "THT-Export-Import System",
      image: exportImportLogo,
      route: "/export-import",
      key: "ExportImportManagement",
    },
    {
      title: "THT-Task Management System",
      image: taskManagementLogo,
      route: "/task-management",
      key: "taskManagement",
    },
    {
      title: "THT-Wowomart Management System",
      image: wowomartLogo,
      route: "/wowomart-management",
      key: "wowomartManagement",
    },
    {
      title: "THT-Translator System",
      image: translatorLogo,
      route: "/translator",
      key: "translatorSystem",
    },
    {
      title: "THT-Attendance Shifting System",
      image: attendanceShiftingLogo,
      route: "/attendance-shifting",
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

  const handleRouteNavigate = (route, enabled) => {
    if (!enabled) {
      setAccessModal(true);
    } else {
      navigate(route);
    }
  };
  console.log(selectedUser);

  return (
    <div className="bg-white rounded-2xl p-6 shadow h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Settings
          <span className="text-[#004368]">
            {selectedUser ? `– ${selectedUser.name}` : ""}
          </span>
          <span className="">
            {selectedUser?.department ? ` (${selectedUser?.department})` : ""}
          </span>
        </h2>
      </div>

      {/* Roles */}
      <p className="text-gray-600 mb-2 font-medium">Employee Role</p>
      <div className="flex items-center gap-6 mb-6 bg-white">
        {["admin", "leader", "employee"].map((key) => (
          <label key={key} className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={roles[key]}
              onChange={() => handleCheckboxClick(key)} // ✅ use the new handler
              disabled={key === "employee" && roles[key]} // employee can't be unchecked
              className="cursor-pointer"
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
            currentUser={currentUser}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setUserData={setUserData}
            handleRouteNavigate={handleRouteNavigate}
            // ✅ Check which management system is enabled for selected user
            defaultEnabled={
              selectedUser &&
              (selectedUser[site.key] === 1 ||
                selectedUser[site.key] === undefined)
            }
          />
        ))}
      </div>
      <RoleSelector
        user={selectedUser}
        loading={loading}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
        handleUpdateRole={handleUpdateRole}
        selectedUser={selectedUser}
      />

      {accessModal && (
        <PermissionModal
          show={accessModal}
          onClose={() => setAccessModal(false)}
        ></PermissionModal>
      )}
    </div>
  );
};

export default EmployeeSettings;
