import { useState } from "react";
import FaceAttendancePaymentManage from "./FaceAttendancePaymentManage";
import FaceAttendanceUsersManagement from "./FaceAttendanceUsersManagement/FaceAttendanceUsersManagement";

export default function FaceAttendanceManagement() {
  const tabs = [
    { key: "users", name: "User Data" },
    { key: "payment", name: "Payment Management" },
  ];

  const [activeTab, setActiveTab] = useState("users"); // default

  return (
    <div className="bg-gray-100 min-h-screen py-12 flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* ===== Page Title ===== */}
        <h2 className="text-3xl font-bold text-center text-[#004368]">
          Face Attendance Management
        </h2>

        {/* ===== Toggle Buttons ===== */}
        <div className="flex justify-center items-center">
          <div className="p-1 bg-slate-300 rounded-full flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-10 py-2 rounded-full text-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-[#004368] text-white font-bold shadow"
                    : "text-gray-600 font-semibold"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Content Section ===== */}
        {activeTab === "users" && (
          <>
            {/* <h2 className="text-2xl font-bold text-center text-[#004368]">
              Face Attendance User Management
            </h2> */}
            <FaceAttendanceUsersManagement />
          </>
        )}

        {activeTab === "payment" && (
          <>
            {/* <h2 className="text-2xl font-bold text-center text-[#004368]">
              Face Attendance Payment Management
            </h2> */}
            <FaceAttendancePaymentManage />
          </>
        )}
      </div>
    </div>
  );
}
