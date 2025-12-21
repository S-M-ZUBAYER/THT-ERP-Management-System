import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DisplaySpinner from "../../../../Shared/Loading/DisplaySpinner";
import FaceAttendanceUsersManagement from "./FaceAttendanceUsersManagement";

export default function FaceAttendancePaymentManage() {
  const [baseUrl, setBaseUrl] = useState(
    "https://grozziieget.zjweiting.com:8033"
  );
  const [maxEmployees, setMaxEmployees] = useState([]);
  const [paymentPackages, setPaymentPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [allowMark, setAllowMark] = useState(null);

  const [editMaxEmployee, setEditMaxEmployee] = useState(null);
  const [editPayment, setEditPayment] = useState(null);

  const servers = [
    { name: "Global", url: "https://grozziieget.zjweiting.com:8033" },
    { name: "China", url: "https://jiapuv.com:8033" },
  ];

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

  const updateMaxEmployee = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/maxEmployees`, {
        package_name: editMaxEmployee.package_name,
        max_employee: Number(editMaxEmployee.max_employee),
      });
      toast.success("Max Employee Updated Successfully");
      setEditMaxEmployee(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const updatePaymentPackage = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/Payment/update`, editPayment);
      toast.success("Payment Package Updated Successfully");
      setEditPayment(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Payment Update Failed");
    }
  };
  console.log(editPayment, editMaxEmployee, "edit payment");

  const updateAllowMark = async () => {
    try {
      await axios.put(`${baseUrl}/tht/attendance/Payment/allowMarkAll`, {
        allowMark: !allowMark,
      });
      setAllowMark(!allowMark);
      toast.success(`Allow Mark updated to ${!allowMark}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update allowMark");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-10">
        {/* Server Switcher */}
        <div className="flex justify-center items-center mb-6 mt-3">
          <div className="p-1 bg-slate-300 rounded-full">
            {servers.map((s) => (
              <button
                key={s.url}
                onClick={() => setBaseUrl(s.url)}
                className={`px-16 py-1 rounded-full text-xl ${
                  s.url === baseUrl
                    ? "bg-[#004368] text-white font-bold"
                    : "text-gray-500 font-semibold"
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
          <DisplaySpinner />
        ) : (
          <>
            {/* Max Employee Table */}
            <div className="bg-white p-6 mt-10 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Max Employee Packages
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse border border-gray-200">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-medium">
                    <tr>
                      <th className="p-3 border-b">Package</th>
                      <th className="p-3 border-b">Max Employee</th>
                      <th className="p-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {maxEmployees.length ? (
                      maxEmployees.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50 border-2">
                          <td className="p-2 border-b">{pkg.package_name}</td>
                          <td className="p-2 border-b">{pkg.max_employee}</td>
                          <td className="p-2 border-b">
                            <button
                              onClick={() => setEditMaxEmployee(pkg)}
                              className="px-4 py-1 bg-[#004368] text-white rounded hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Packages Table */}
            <div className="bg-white p-6 mt-10 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Payment Packages
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse border border-gray-200">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-medium">
                    <tr>
                      <th className="p-3 border-b">Package</th>
                      <th className="p-3 border-b">Duration</th>
                      <th className="p-3 border-b">USD</th>
                      <th className="p-3 border-b">EUR</th>
                      <th className="p-3 border-b">SGD</th>
                      <th className="p-3 border-b">CNY</th>
                      <th className="p-3 border-b">AllowMark</th>
                      <th className="p-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {paymentPackages.length ? (
                      paymentPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50 border-2">
                          <td className="p-2 border-b">{pkg.package_name}</td>
                          <td className="p-2 border-b">
                            {pkg.duration_months} Months
                          </td>
                          <td className="p-2 border-b">{pkg.USD}</td>
                          <td className="p-2 border-b">{pkg.EUR}</td>
                          <td className="p-2 border-b">{pkg.SGD}</td>
                          <td className="p-2 border-b">{pkg.CNY}</td>
                          <td className="p-2 border-b">
                            {pkg.allowMark ? "Yes" : "No"}
                          </td>
                          <td className="p-2 border-b">
                            <button
                              onClick={() => setEditPayment(pkg)}
                              className="px-4 py-1 bg-[#004368] text-white rounded hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Global AllowMark */}
            {allowMark !== null && (
              <div className="bg-white p-6 mt-10 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-semibold mb-3 text-gray-700">
                  Attendance AllowMark (Global)
                </h3>
                <p className="mb-4 text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={allowMark ? "text-green-600" : "text-red-600"}
                  >
                    {allowMark ? "Enabled" : "Disabled"}
                  </span>
                </p>
                <button
                  onClick={updateAllowMark}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                    allowMark
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {allowMark ? "Disable" : "Enable"} Attendance Payment
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Edit Max Employee Modal */}
      {editMaxEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Max Employee</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Package Name
              </label>
              <input
                type="text"
                disabled
                value={editMaxEmployee.package_name}
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Max Employee
              </label>
              <input
                type="number"
                value={editMaxEmployee.max_employee}
                onChange={(e) =>
                  setEditMaxEmployee({
                    ...editMaxEmployee,
                    max_employee: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditMaxEmployee(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateMaxEmployee}
                className="px-4 py-2 bg-[#004368] text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Max Employee Modal */}
      {editMaxEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 w-full max-w-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Max Employee</h3>

            <div className="mb-4">
              <label className="block text-base font-medium mb-1">
                Package Name
              </label>
              <input
                type="text"
                disabled
                value={editMaxEmployee.package_name}
                className="w-full border px-3 py-2 rounded bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-medium mb-1 ">
                Max Employee
              </label>
              <input
                type="number"
                value={editMaxEmployee.max_employee}
                onChange={(e) =>
                  setEditMaxEmployee({
                    ...editMaxEmployee,
                    max_employee: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded bg-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditMaxEmployee(null)}
                className="px-4 py-2 text-gray-700 bg-yellow-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateMaxEmployee}
                className="px-4 py-2 bg-[#004368] text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Payment Package Modal */}
      {editPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-700 w-full max-w-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Payment Package</h3>

            <div className="grid grid-cols-2 gap-4 bg-white">
              {["USD", "EUR", "SGD", "CNY"].map((currency) => (
                <div key={currency}>
                  <label className="block text-sm font-medium mb-1">
                    {currency}
                  </label>
                  <input
                    type="number"
                    value={editPayment[currency]}
                    onChange={(e) =>
                      setEditPayment({
                        ...editPayment,
                        [currency]: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 bg-white rounded"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="font-medium">Allow Mark</label>
              <input
                type="checkbox"
                checked={editPayment.allowMark}
                onChange={(e) =>
                  setEditPayment({
                    ...editPayment,
                    allowMark: e.target.checked,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditPayment(null)}
                className="px-4 py-2 text-gray-700 bg-yellow-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updatePaymentPackage}
                className="px-4 py-2 bg-[#004368] text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
