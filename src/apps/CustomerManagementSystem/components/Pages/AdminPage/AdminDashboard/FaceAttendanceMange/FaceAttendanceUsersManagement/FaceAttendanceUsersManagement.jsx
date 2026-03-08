// FaceAttendanceUsersManagement.jsx (Complete)
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

// Import all components
import DisplaySpinner from "./DisplaySpinner";
import Pagination from "./Pagination";
import DeviceGrid from "./DeviceGrid";
import RefreshButton from "./RefreshButton";
import ExportButtons from "./ExportButtons";
import DateRangePicker from "./DateRangePicker";
import AdminCard from "./AdminCard";
import EmployeeCard from "./EmployeeCard";
import EmployeeModal from "./EmployeeModal";

// Import export utilities
import { exportAllHistoryToExcel } from "../utils/excelExportUtils";
import { exportDatewiseCountToExcel } from "../utils/excelDatewiseExport";
import DeviceEmployeeExport from "./DeviceEmployeeExport";

const BASE_URL =
  "https://grozziie.zjweiting.com:3091/grozziie-attendance-debug";
const DEVICES_PER_PAGE = 9;

export default function FaceAttendanceUsersManagement() {
  // ========== STATE DECLARATIONS ==========
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicePage, setDevicePage] = useState(0);
  const [employeeLoadingForSelected, setEmployeeLoadingForSelected] =
    useState(false);
  const [loadedDeviceIds, setLoadedDeviceIds] = useState(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportLoading, setExportLoading] = useState({
    allHistory: false,
    datewise: false,
  });

  const loadingAttemptedRef = useRef(new Set());

  // ========== EFFECTS ==========
  // Load devices on mount
  useEffect(() => {
    const loadDevices = async () => {
      setDevicesLoading(true);
      try {
        const { data: deviceList } = await axios.get(`${BASE_URL}/devices/all`);
        const devicesWithoutEmployees = deviceList.map((device) => ({
          ...device,
          employees: [],
          employeeCount: 0,
          isLoading: false,
        }));
        setDevices(devicesWithoutEmployees);
      } catch (err) {
        console.error("Error loading devices:", err);
      } finally {
        setDevicesLoading(false);
      }
    };
    loadDevices();
  }, []);

  // Load employees for current page
  useEffect(() => {
    if (devicesLoading || devices.length === 0) return;

    const loadCurrentPageEmployees = async () => {
      const start = devicePage * DEVICES_PER_PAGE;
      const end = start + DEVICES_PER_PAGE;
      const currentDevices = devices.slice(start, end);
      const devicesToLoad = currentDevices.filter(
        (device) => !loadedDeviceIds.has(device.id) && !device.isLoading,
      );

      if (devicesToLoad.length === 0) return;

      setDevices((prev) =>
        prev.map((device) => {
          if (devicesToLoad.some((d) => d.id === device.id)) {
            return { ...device, isLoading: true };
          }
          return device;
        }),
      );

      try {
        const results = await Promise.allSettled(
          devicesToLoad.map((device) =>
            axios
              .get(
                `${BASE_URL}/employee/all/${device.deviceMAC}/withoutEmbedding?page=0&size=100`,
              )
              .then((res) => ({
                deviceId: device.id,
                employees: res?.data?.data || [],
                count: res?.data?.data?.length || 0,
              })),
          ),
        );

        setDevices((prev) =>
          prev.map((device) => {
            const result = results.find(
              (r) => r.status === "fulfilled" && r.value.deviceId === device.id,
            );
            if (result) {
              return {
                ...device,
                employees: result.value.employees,
                employeeCount: result.value.count,
                isLoading: false,
              };
            }
            if (devicesToLoad.some((d) => d.id === device.id)) {
              return { ...device, isLoading: false };
            }
            return device;
          }),
        );

        setLoadedDeviceIds((prev) => {
          const newSet = new Set(prev);
          devicesToLoad.forEach((d) => newSet.add(d.id));
          return newSet;
        });
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    loadCurrentPageEmployees();
  }, [devicePage, devices.length, devicesLoading, loadedDeviceIds]);

  // ========== HANDLERS ==========
  const handleSelectDevice = useCallback(async (device) => {
    if (device.isLoading) return;

    setSelectedDevice(device);
    setEmployeeLoadingForSelected(true);
    loadingAttemptedRef.current.add(device.id);

    if (device.employees && device.employees.length > 0) {
      setEmployees(device.employees);
      setEmployeeLoadingForSelected(false);
    } else {
      setEmployees([]);
    }

    setLoading(true);

    try {
      const adminRes = await axios.get(
        `${BASE_URL}/admin/by-device/${device.deviceMAC}`,
      );
      setAdmins(adminRes.data || []);

      if (!device.employees || device.employees.length === 0) {
        const employeeRes = await axios.get(
          `${BASE_URL}/employee/all/${device.deviceMAC}/withoutEmbedding?page=0&size=100`,
        );
        const newEmployees = employeeRes?.data?.data || [];
        setEmployees(newEmployees);

        setDevices((prev) =>
          prev.map((d) =>
            d.id === device.id
              ? {
                  ...d,
                  employees: newEmployees,
                  employeeCount: newEmployees.length,
                }
              : d,
          ),
        );
        setLoadedDeviceIds((prev) => new Set([...prev, device.id]));
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setAdmins([]);
    } finally {
      setLoading(false);
      setEmployeeLoadingForSelected(false);
    }
  }, []);

  const cleanName = useCallback((name = "") => name.split("<")[0].trim(), []);

  const handleEmployeeClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  }, []);

  const closeEmployeeModal = useCallback(() => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  }, []);

  const refreshSelectedDeviceEmployees = useCallback(async () => {
    if (!selectedDevice) return;

    setEmployeeLoadingForSelected(true);
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/employee/all/${selectedDevice.deviceMAC}/withoutEmbedding?page=0&size=100`,
      );
      const newEmployees = res?.data?.data || [];
      setEmployees(newEmployees);
      setDevices((prev) =>
        prev.map((device) =>
          device.id === selectedDevice.id
            ? {
                ...device,
                employees: newEmployees,
                employeeCount: newEmployees.length,
              }
            : device,
        ),
      );
      setLoadedDeviceIds((prev) => new Set([...prev, selectedDevice.id]));
    } catch (err) {
      console.error("Error refreshing employees:", err);
    } finally {
      setLoading(false);
      setEmployeeLoadingForSelected(false);
    }
  }, [selectedDevice]);

  const handlePrevPage = () => {
    if (devicePage > 0) setDevicePage(devicePage - 1);
  };

  const handleNextPage = () => {
    if ((devicePage + 1) * DEVICES_PER_PAGE < devices.length) {
      setDevicePage(devicePage + 1);
    }
  };

  const handleExportAll = () => {
    exportAllHistoryToExcel(devices, setExportLoading);
  };

  const handleExportDatewise = () => {
    exportDatewiseCountToExcel(
      devices,
      startDate,
      endDate,
      setExportLoading,
      setShowDateRangePicker,
    );
  };

  // ========== COMPUTED VALUES ==========
  const paginatedDevices = devices.slice(
    devicePage * DEVICES_PER_PAGE,
    (devicePage + 1) * DEVICES_PER_PAGE,
  );
  const totalPages = Math.ceil(devices.length / DEVICES_PER_PAGE);
  const isLastPage = devicePage === totalPages - 1;

  // ========== RENDER ==========
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Test */}
      <DeviceEmployeeExport></DeviceEmployeeExport>

      {/* Devices Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#004368]">
          {devicesLoading
            ? "Loading Devices..."
            : `Devices Information (${devices.length})`}
        </h2>

        {selectedDevice && (
          <RefreshButton
            onRefresh={refreshSelectedDeviceEmployees}
            loading={employeeLoadingForSelected}
          />
        )}

        {devicesLoading ? (
          <div className="h-80">
            <DisplaySpinner />
          </div>
        ) : (
          <div>
            <Pagination
              currentPage={devicePage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />

            <DeviceGrid
              devices={paginatedDevices}
              selectedDevice={selectedDevice}
              onSelectDevice={handleSelectDevice}
            />

            {isLastPage && devices.length > 0 && (
              <div className="relative">
                <ExportButtons
                  onExportAll={handleExportAll}
                  onExportDatewise={() =>
                    setShowDateRangePicker(!showDateRangePicker)
                  }
                  loading={exportLoading}
                  showDatePicker={showDateRangePicker}
                  setShowDatePicker={setShowDateRangePicker}
                />
                <DateRangePicker
                  show={showDateRangePicker}
                  startDate={startDate}
                  endDate={endDate}
                  onStartChange={setStartDate}
                  onEndChange={setEndDate}
                  onExport={handleExportDatewise}
                  onCancel={() => setShowDateRangePicker(false)}
                  loading={exportLoading.datewise}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Employee Details Section */}
      {selectedDevice && (
        <div className="mt-10 space-y-8">
          {loading ? (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-60 flex items-center justify-center">
                <DisplaySpinner />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-[#004368]">
                Employee Information ({employees.length})
              </h2>

              {/* Admins */}
              <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Admins ({admins.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <AdminCard key={admin.id} admin={admin} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-red-400 my-10">
                    No Admin Available
                  </p>
                )}
              </div>

              {/* Employees */}
              <h3 className="text-xl font-semibold my-4 border-b pb-2 text-gray-700">
                Employees ({employees.length})
              </h3>

              {employeeLoadingForSelected && employees.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading employee data...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center my-10">
                  <p className="text-red-400 mb-4">
                    No Employee Data Available
                  </p>
                  <button
                    onClick={refreshSelectedDeviceEmployees}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 mx-auto"
                  >
                    Load Employees
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {employees.map((emp, index) => (
                    <EmployeeCard
                      key={index}
                      employee={emp}
                      onSelect={handleEmployeeClick}
                      cleanName={cleanName}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Employee Modal */}
      {showEmployeeModal && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={closeEmployeeModal}
        />
      )}
    </div>
  );
}
