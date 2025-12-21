import React, { useEffect, useState } from "react";
import axios from "axios";
import DisplaySpinner from "../../../../Shared/Loading/DisplaySpinner";

const BASE_URL =
  "https://grozziie.zjweiting.com:3091/grozziie-attendance-debug";
const MEDIA_URL = `${BASE_URL}/media`;

export default function FaceAttendanceUsersManagement() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);

  // pagination state
  const [devicePage, setDevicePage] = useState(0);
  const DEVICES_PER_PAGE = 9;

  // 🔹 Load Devices + Device-wise Employees (FIRST TIME)
  useEffect(() => {
    const loadDevicesWithEmployees = async () => {
      setDevicesLoading(true);
      try {
        const { data: deviceList } = await axios.get(`${BASE_URL}/devices/all`);

        const devicesWithEmployees = await Promise.all(
          deviceList.map(async (device) => {
            try {
              const empRes = await axios.get(
                // `${BASE_URL}/employee/all/${device.deviceMAC}`
                `${BASE_URL}/employee/all/${device.deviceMAC}/withoutEmbedding?page=0&size=100`
              );
              console.log(empRes, "response");

              return {
                ...device,
                employees: empRes?.data?.data || [],
                employeeCount: empRes?.data?.data?.length || 0,
              };
            } catch {
              return {
                ...device,
                employees: [],
                employeeCount: 0,
              };
            }
          })
        );

        setDevices(devicesWithEmployees);
        setDevicesLoading(false);
      } catch (err) {
        console.error(err);
        setDevicesLoading(false);
      }
    };

    loadDevicesWithEmployees();
  }, []);

  // 🔹 When device selected → load admins + reuse employees
  const handleSelectDevice = async (device) => {
    setSelectedDevice(device);
    setEmployees(device.employees || []);
    setLoading(true);

    try {
      const adminRes = await axios.get(
        `${BASE_URL}/admin/by-device/${device.deviceMAC}`
      );
      setAdmins(adminRes.data || []);
    } catch (err) {
      console.error(err);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const cleanName = (name = "") => name.split("<")[0].trim();

  const paginatedDevices = devices.slice(
    devicePage * DEVICES_PER_PAGE,
    (devicePage + 1) * DEVICES_PER_PAGE
  );

  const prevPage = () => {
    if (devicePage > 0) setDevicePage(devicePage - 1);
  };

  const nextPage = () => {
    if ((devicePage + 1) * DEVICES_PER_PAGE < devices?.length)
      setDevicePage(devicePage + 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#004368]">
          {devicesLoading ? "" : `Devices Information (${devices?.length})`}
        </h2>

        {/* 🔹 Device List with Pagination */}
        {devicesLoading ? (
          <div className="h-80">
            {" "}
            <DisplaySpinner />
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-2 text-gray-700">
              <button
                onClick={prevPage}
                disabled={devicePage === 0}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                &larr; Prev
              </button>
              <button
                onClick={nextPage}
                disabled={
                  (devicePage + 1) * DEVICES_PER_PAGE >= devices?.length
                }
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
              {paginatedDevices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleSelectDevice(device)}
                  className={`p-4 rounded-xl cursor-pointer border transition
                  ${
                    selectedDevice?.id === device.id
                      ? "bg-[#004368] text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <h3 className="font-semibold">{device.deviceName}</h3>
                  <p className="text-sm">{device.deviceMAC}</p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      selectedDevice?.id === device.id
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    Employees: {device.employeeCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 🔹 Details Section */}
      {selectedDevice && (
        <div className="mt-10 space-y-8">
          {loading ? (
            <DisplaySpinner></DisplaySpinner>
          ) : (
            <>
              {/* 👥 Admins + Employees */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-[#004368]">
                  {devicesLoading
                    ? ""
                    : `Employee Information (${employees?.length})`}
                </h2>
                {/* Admin Section */}
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                  Admins ({admins?.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {admins?.length > 0 ? (
                    admins?.map((admin) => (
                      <div
                        key={admin.id}
                        className="text-center border rounded-lg p-4 bg-yellow-50 border-yellow-300 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                      >
                        <p className="font-medium text-sm text-gray-800">
                          {admin.adminName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {admin.adminEmail}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full font-semibold">
                          Admin
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="w-full text-center text-red-400 my-10">
                      No Admin Available
                    </p>
                  )}
                </div>

                {/* Employee Section */}
                <h3 className="text-xl font-semibold my-4 border-b pb-2 text-gray-700">
                  Employees ({employees?.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {employees?.length > 0 ? (
                    employees?.map((emp, index) => (
                      <div
                        key={index}
                        className={`text-center border rounded-lg p-4 transition transform hover:-translate-y-1 hover:shadow-md
            ${emp.isLeader ? "bg-blue-50 border-blue-300" : "bg-white"}`}
                      >
                        <div className="w-14 h-14 mx-auto mb-2">
                          <img
                            src={
                              emp.imageFile
                                ? `${MEDIA_URL}/${emp.imageFile}`
                                : "/avatar.png"
                            }
                            alt={emp.name}
                            className="w-full h-full rounded-full object-cover border border-gray-200"
                          />
                        </div>
                        <p className="font-medium text-sm text-gray-800">
                          {cleanName(emp.name)}
                        </p>
                        {emp.isLeader && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full font-semibold">
                            Leader
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="w-full text-center text-red-400 my-10">
                      No Employee Available
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
