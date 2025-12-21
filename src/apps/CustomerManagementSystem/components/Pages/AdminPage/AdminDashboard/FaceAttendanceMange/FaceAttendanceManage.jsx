import React from "react";
import FaceAttendanceUsersManagement from "./FaceAttendanceUsersManagement";
import FaceAttendancePaymentManage from "./FaceAttendancePaymentManage";

const FaceAttendanceManage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-10">
        <h2 className="text-3xl font-bold text-center text-[#004368]">
          Face Attendance User Management
        </h2>
        <FaceAttendanceUsersManagement></FaceAttendanceUsersManagement>
        <h2 className="text-3xl font-bold text-center text-[#004368]">
          Face Attendance Payment Management
        </h2>
        <FaceAttendancePaymentManage></FaceAttendancePaymentManage>
      </div>
    </div>
  );
};

export default FaceAttendanceManage;
