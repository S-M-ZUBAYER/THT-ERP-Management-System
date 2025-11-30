import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DisplaySpinner from "@/apps/CustomerManagementSystem/components/Shared/Loading/DisplaySpinner";

export default function FaceAttendanceManage() {
  const [baseUrl, setBaseUrl] = useState(
    "https://grozziieget.zjweiting.com:8033"
  );
  const [maxEmployees, setMaxEmployees] = useState([]);
  const [paymentPackages, setPaymentPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [allowMark, setAllowMark] = useState(null); // Global allowMark

  // Editable fields
  const [editMaxEmployee, setEditMaxEmployee] = useState(null);
  const [editPayment, setEditPayment] = useState(null);

  const servers = [
    { name: "Global", url: "https://grozziieget.zjweiting.com:8033" },
    { name: "China", url: "https://jiapuv.com:8033" },
  ];

  // ============================
  // Fetch all data
  // ============================
  useEffect(() => {
    fetchAllData();
  }, [baseUrl]);

  const fetchAllData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const maxEmpRes = await axios.get(
        `${baseUrl}/tht/attendance/maxEmployees`
      );
      const payRes = await axios.get(`${baseUrl}/tht/attendance/Payment`);
      const allowRes = await axios.get(
        `${baseUrl}/tht/attendance/Payment/check/checkAllowMark`
      );

      setMaxEmployees(maxEmpRes.data.data.data);
      setPaymentPackages(payRes.data.data.packages);
      setAllowMark(allowRes.data.data.allEnabled);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMaxEmployees([]);
      setPaymentPackages([]);
      setAllowMark(null);
      setMessage("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Update Max Employee
  // ============================
  const updateMaxEmployee = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/maxEmployees`, {
        package_name: editMaxEmployee.package_name,
        max_employee: Number(editMaxEmployee.max_employee),
      });

      setMessage("Max Employee Updated Successfully");
      toast.success("Max Employee Updated Successfully");
      setEditMaxEmployee(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
      toast.error("Update failed");
    }
  };

  // ============================
  // Update Payment Package
  // ============================
  const updatePaymentPackage = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/Payment/update`, editPayment);

      setMessage("Payment Package Updated Successfully");
      toast.success("Payment Package Updated Successfully");
      setEditPayment(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage("Payment Update Failed");
      toast.error("Payment Update Failed");
    }
  };

  // ============================
  // Update AllowMark (Global ON/OFF)
  // ============================
  const updateAllowMark = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/Payment/allowMarkAll`, {
        allowMark: !allowMark, // true/false
      });

      setMessage("AllowMark Updated");
      setAllowMark(!allowMark);
      toast.success(`Allow Mark successfully Updated to ${!allowMark}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update allowMark");
      toast.error("Failed to update allowMark");
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center flex-1 text-3xl font-bold text-[#004368] my-5">
          Face Attendance Users Management
        </h2>
      </div>
      {/* ================= SERVER SWITCHER ================= */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-300 p-1 rounded-full flex gap-4">
          {servers.map((s) => (
            <button
              key={s.url}
              onClick={() => setBaseUrl(s.url)}
              className={`px-10 py-2 rounded-full ${
                s.url === baseUrl ? "bg-[#004368] text-white" : "text-gray-700"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="text-center text-green-600 font-semibold">{message}</p>
      )}

      {loading ? (
        <div className="h-screen">
          <DisplaySpinner></DisplaySpinner>
        </div>
      ) : (
        <div className="space-y-10">
          {/* =================================================== */}
          {/* MAX EMPLOYEE TABLE */}
          {/* =================================================== */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Max Employee Packages</h2>

            <table className="w-full border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2">Package</th>
                  <th className="p-2">Max Employee</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maxEmployees.length > 0 ? (
                  [...maxEmployees]
                    .sort((a, b) => a.max_employee - b.max_employee) // Sort by max_employee ascending
                    .map((pkg) => (
                      <tr key={pkg.id} className="border-b">
                        <td className="p-2">{pkg.package_name}</td>
                        <td className="p-2">{pkg.max_employee}</td>
                        <td className="p-2">
                          <button
                            onClick={() => setEditMaxEmployee(pkg)}
                            className="px-3 py-1 bg-[#004368] text-white rounded"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MAX EMPLOYEE MODAL */}
          {editMaxEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
              <div className="bg-white p-6 w-96 rounded-lg shadow-xl">
                <h3 className="text-xl font-bold mb-4">Update Max Employee</h3>

                <input
                  type="number"
                  value={editMaxEmployee.max_employee}
                  onChange={(e) =>
                    setEditMaxEmployee({
                      ...editMaxEmployee,
                      max_employee: e.target.value,
                    })
                  }
                  className="w-full border p-2 mb-3"
                />

                <button
                  onClick={updateMaxEmployee}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditMaxEmployee(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* PAYMENT PACKAGES */}
          {/* =================================================== */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Payment Packages</h2>

            <table className="w-full border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2">Package</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">USD</th>
                  <th className="p-2">EUR</th>
                  <th className="p-2">SGD</th>
                  <th className="p-2">CNY</th>
                  <th className="p-2">AllowMark</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentPackages.length > 0 ? (
                  paymentPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b">
                      <td className="p-2">{pkg.package_name}</td>
                      <td className="p-2">{pkg.duration_months} Months</td>
                      <td className="p-2">{pkg.USD}</td>
                      <td className="p-2">{pkg.EUR}</td>
                      <td className="p-2">{pkg.SGD}</td>
                      <td className="p-2">{pkg.CNY}</td>
                      <td className="p-2">{pkg.allowMark}</td>
                      <td className="p-2">
                        <button
                          onClick={() => setEditPayment(pkg)}
                          className="px-3 py-1 bg-[#004368] text-white rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* EDIT PAYMENT PACKAGE MODAL */}
          {editPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
              <div className="bg-white p-6 w-[450px] rounded-lg shadow-xl">
                <h3 className="text-xl font-bold mb-4">
                  Update Payment Package
                </h3>

                {[
                  "package_name",
                  "duration_months",
                  "USD",
                  "EUR",
                  "SGD",
                  "CNY",
                  "allowMark",
                ].map((field) => (
                  <div key={field} className="mb-3">
                    <label className="block text-gray-700 font-semibold mb-1 capitalize">
                      {field.replace("_", " ")}
                    </label>

                    <input
                      type={
                        [
                          "duration_months",
                          "USD",
                          "EUR",
                          "SGD",
                          "CNY",
                          "allowMark",
                        ].includes(field)
                          ? "number"
                          : "text"
                      }
                      value={editPayment[field]}
                      onChange={(e) =>
                        !["package_name", "allowMark"].includes(field) &&
                        setEditPayment({
                          ...editPayment,
                          [field]: e.target.value,
                        })
                      }
                      readOnly={["package_name", "allowMark"].includes(field)}
                      className={`w-full border p-2 rounded ${
                        ["package_name", "allowMark"].includes(field)
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder={field}
                    />
                  </div>
                ))}

                <button
                  onClick={updatePaymentPackage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Update
                </button>

                <button
                  onClick={() => setEditPayment(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* GLOBAL ALLOWMARK TOGGLE */}
          {/* =================================================== */}
          {allowMark !== null && allowMark !== undefined && (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h2 className="text-xl font-bold mb-3">
                Attendance AllowMark (Global)
              </h2>

              <p className="text-lg font-semibold mb-3">
                Status:{" "}
                <span className={allowMark ? "text-green-600" : "text-red-600"}>
                  {allowMark ? "Enabled" : "Disabled"}
                </span>
              </p>

              <button
                onClick={updateAllowMark}
                className={`px-6 py-3 rounded-lg text-white ${
                  allowMark ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {allowMark ? "Disable" : "Enable"} Attendance Payment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
