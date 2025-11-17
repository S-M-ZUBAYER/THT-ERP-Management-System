import React, { useState, useEffect } from "react";
import Navbar from "../SharedPage/Navbar";
import AdminList from "../SettingPage/AdminList";
import EmployeeSettings from "../SettingPage/EmployeeSettings";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [userData, setUserData] = useState({
    admin: [],
    leader: [],
    employee: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://grozziieget.zjweiting.com:8033/tht/allUsers"
        );
        const users = await res.json();

        const categorized = {
          admin: users.filter((u) => u.superAdmin === 1),
          leader: users.filter((u) => u.leader === 1),
          employee: users.filter(
            (u) => u.superAdmin !== 1 && u.leader !== 1 && u.isAdmin !== "true"
          ),
        };

        setUserData(categorized);

        // ✅ Auto-select the first user from default tab
        if (categorized[activeTab]?.length > 0) {
          setSelectedUser(categorized[activeTab][0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center px-4 sm:px-6 py-8 w-full max-w-9xl">
      <Navbar />

      {/* Tabs */}
      <div className="flex flex-wrap justify-start gap-3 mt-10 w-full ">
        {["admin", "leader", "employee"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm("");
            }}
            className={`px-5 py-2 rounded-full font-medium transition text-sm sm:text-base ${
              activeTab === tab
                ? "bg-[#004368] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {userData[tab]?.length || 0})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:w-1/3">
          <AdminList
            activeTab={activeTab}
            userData={userData[activeTab]}
            setUserData={setUserData}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            currentUser={currentUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex-1">
          <EmployeeSettings
            activeTab={activeTab}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setUserData={setUserData}
            currentUser={currentUser}
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center text-lg font-semibold">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Setting;
