import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { AuthContext } from "../../../../../context/UserContext";
import DisplaySpinner from "../../../../Shared/Loading/DisplaySpinner";

const ShowHightWidth = () => {
  const [allModelInfo, setAllModelInfo] = useState([]);
  const [connectivityList, setConnectivityList] = useState([]);
  const [deviceTypeList, setDeviceTypeList] = useState([]);
  const [modelDeviceConfigs, setModelDeviceConfigs] = useState([]);
  const [modelConfigForm, setModelConfigForm] = useState({
    deviceType: "",
    connectivity: "",
    printedLine: "100",
    bufferLimit: "",
  });
  const [editConfigData, setEditConfigData] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [configSubmitting, setConfigSubmitting] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const modelNo = location.pathname.split("/").pop().replace(/%20/g, " ");

  // Get baseUrl from query string
  const params = new URLSearchParams(location.search);
  const baseUrl = params.get("baseUrl");

  // get data from useContext
  const { loading, setLoading } = useContext(AuthContext);
  const connectedOptions = [
    { value: "", label: "None" },
    { value: 1, label: "Bluetooth" },
    { value: 2, label: "WiFi" },
    { value: 3, label: "Bluetooth & WiFi" },
  ];
  const parseConnectedValue = (value) => (value === "" ? null : Number(value));
  const getPrintedLineValue = (value) =>
    value === undefined || value === null || value === ""
      ? "100"
      : String(value);
  const getConnectivityValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          return parsedValue
            .map((item) => String(item).trim())
            .filter(Boolean);
        }
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };
  const getConnectivityLabel = (value) => {
    const connectivity = getConnectivityValue(value);
    return connectivity.length > 0 ? connectivity.join(", ") : "None";
  };
  const getSingleConnectivityValue = (value) => {
    const connectivity = getConnectivityValue(value);
    return connectivity.length > 0 ? connectivity[0] : "";
  };
  const getEditConnectivityOptions = () => {
    const connectivityNames = connectivityList
      .map((item) => item.connectivity)
      .filter(Boolean);
    const selectedConnectivityNames = getConnectivityValue(editModalData?.connectivity);

    return Array.from(new Set([...connectivityNames, ...selectedConnectivityNames]));
  };
  const getModelConfigConnectivityOptions = (selectedValue) => {
    const connectivityNames = connectivityList
      .map((item) => item.connectivity)
      .filter(Boolean);
    const selectedConnectivityNames = getConnectivityValue(selectedValue);

    return Array.from(new Set([...connectivityNames, ...selectedConnectivityNames]));
  };
  const getDeviceTypeOptions = () =>
    deviceTypeList
      .map((item) => (typeof item === "string" ? item : item.deviceType))
      .filter(Boolean);
  const getConnectedLabel = (connected) => {
    if (connected === null || connected === undefined || connected === "") {
      return "None";
    }

    return (
      connectedOptions.find((option) => option.value === Number(connected))
        ?.label || "None"
    );
  };

  // Fetch all model info for the specified model number
  useEffect(() => {
    const apiUrl = `${baseUrl}/tht/modelInfo/${modelNo}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setAllModelInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [modelNo, baseUrl]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/tht/connectivity/list`)
      .then((response) => {
        setConnectivityList(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching connectivity list:", error);
        setConnectivityList([]);
      });
  }, [baseUrl]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/tht/deviceType/list`)
      .then((response) => {
        setDeviceTypeList(response.data?.result || response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching device type list:", error);
        setDeviceTypeList([]);
      });
  }, [baseUrl]);

  const fetchModelDeviceConfigs = () => {
    setConfigLoading(true);
    axios
      .get(`${baseUrl}/tht/modelDeviceConfig/${encodeURIComponent(modelNo)}`)
      .then((response) => {
        setModelDeviceConfigs(response.data?.result || response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching model device config:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load model device config",
        );
        setModelDeviceConfigs([]);
      })
      .finally(() => {
        setConfigLoading(false);
      });
  };

  useEffect(() => {
    fetchModelDeviceConfigs();
  }, [modelNo, baseUrl]);

  // Handle delete functionality
  const handleToDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Model Information?",
    );
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete(`${baseUrl}/tht/modelInfo/delete/${id}`);
      toast.success("Model Information deleted successfully");
      setAllModelInfo(allModelInfo.filter((city) => city.id !== id));
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Failed to delete city");
    }
  };

  // Handle edit functionality
  const handleToEdit = (data) => {
    setEditModalData({
      ...data,
      connected: data?.connected ?? null,
      printedLine: getPrintedLineValue(data?.printedLine),
      connectivity: getConnectivityValue(data?.connectivity),
    });
    setIsModalOpen(true);
  };

  const handleConnectivityChange = (event) => {
    const { value, checked } = event.target;
    const currentConnectivity = getConnectivityValue(editModalData?.connectivity);

    setEditModalData({
      ...editModalData,
      connectivity: checked
        ? [...currentConnectivity, value]
        : currentConnectivity.filter((item) => item !== value),
    });
  };

  const handleModelConfigConnectivityChange = (event) => {
    setModelConfigForm({
      ...modelConfigForm,
      connectivity: event.target.value,
    });
  };

  const handleEditConfigConnectivityChange = (event) => {
    setEditConfigData({
      ...editConfigData,
      connectivity: event.target.value,
    });
  };

  const validateModelConfigNumbers = ({ printedLine, bufferLimit }) => {
    const printedLineValue = String(printedLine ?? "").trim() || "100";
    const parsedPrintedLine = Number(printedLineValue);
    const bufferLimitValue = String(bufferLimit ?? "").trim();
    const parsedBufferLimit = Number(bufferLimitValue);

    if (!Number.isInteger(parsedPrintedLine) || parsedPrintedLine < 0) {
      toast.error("Printed Line must be a valid number");
      return null;
    }

    if (
      bufferLimitValue &&
      (!Number.isInteger(parsedBufferLimit) || parsedBufferLimit < 0)
    ) {
      toast.error("Buffer Limit must be a valid number");
      return null;
    }

    return {
      printedLine: parsedPrintedLine,
      bufferLimit: bufferLimitValue ? parsedBufferLimit : null,
    };
  };

  const handleModelConfigSubmit = async (e) => {
    e.preventDefault();

    if (!modelConfigForm.deviceType) {
      toast.error("Please select device type");
      return;
    }

    if (!modelConfigForm.connectivity) {
      toast.error("Please select connectivity");
      return;
    }

    const numberValues = validateModelConfigNumbers(modelConfigForm);
    if (!numberValues) {
      return;
    }

    setConfigSubmitting(true);

    try {
      const response = await axios.post(`${baseUrl}/tht/modelDeviceConfig/add`, {
        modelName: modelNo,
        deviceType: modelConfigForm.deviceType,
        connectivity: modelConfigForm.connectivity,
        printedLine: numberValues.printedLine,
        bufferLimit: numberValues.bufferLimit,
      });

      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Add failed");
      }

      toast.success("Model device config added successfully");
      setModelConfigForm({
        deviceType: "",
        connectivity: "",
        printedLine: "100",
        bufferLimit: "",
      });
      fetchModelDeviceConfigs();
    } catch (error) {
      console.error("Add model device config error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to add model device config",
      );
    } finally {
      setConfigSubmitting(false);
    }
  };

  const handleConfigEdit = (data) => {
    setEditConfigData({
      ...data,
      modelName: data?.modelName || modelNo,
      connectivity: getSingleConnectivityValue(data?.connectivity),
      printedLine: getPrintedLineValue(data?.printedLine),
      bufferLimit: data?.bufferLimit ?? "",
    });
    setIsConfigModalOpen(true);
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();

    if (!editConfigData?.id) {
      toast.error("Invalid model device config");
      return;
    }

    if (!editConfigData.deviceType) {
      toast.error("Please select device type");
      return;
    }

    if (!editConfigData.connectivity) {
      toast.error("Please select connectivity");
      return;
    }

    const numberValues = validateModelConfigNumbers(editConfigData);
    if (!numberValues) {
      return;
    }

    setConfigSubmitting(true);

    try {
      const response = await axios.put(
        `${baseUrl}/tht/modelDeviceConfig/update/${editConfigData.id}`,
        {
          modelName: editConfigData.modelName || modelNo,
          deviceType: editConfigData.deviceType,
          connectivity: editConfigData.connectivity,
          printedLine: numberValues.printedLine,
          bufferLimit: numberValues.bufferLimit,
        },
      );

      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Update failed");
      }

      toast.success("Model device config updated successfully");
      setIsConfigModalOpen(false);
      setEditConfigData(null);
      fetchModelDeviceConfigs();
    } catch (error) {
      console.error("Update model device config error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to update model device config",
      );
    } finally {
      setConfigSubmitting(false);
    }
  };

  const handleConfigDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this model device config?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/tht/modelDeviceConfig/delete/${id}`);
      toast.success("Model device config deleted successfully");
      setModelDeviceConfigs((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete model device config error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to delete model device config",
      );
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // 🛡 Prevent empty or invalid submission
    if (!editModalData?.id) {
      toast.error("Invalid model data. Please try again.");
      return;
    }
    console.log(editModalData);
    const printedLineValue = getPrintedLineValue(editModalData?.printedLine);
    const parsedPrintedLine = Number(printedLineValue);

    if (!Number.isInteger(parsedPrintedLine) || parsedPrintedLine < 0) {
      toast.error("Printed Line must be a valid number");
      return;
    }

    try {
      const updatePayload = {
        ...editModalData,
        printedLine: parsedPrintedLine,
        connectivity: getConnectivityValue(editModalData?.connectivity),
      };

      const response = await axios.put(
        `${baseUrl}/tht/bluetoothModelHightWidth/update/${editModalData.id}`,
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // ⏱ prevent infinite hanging
        },
      );

      // ✅ API success validation
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Update failed");
      }

      // 🔁 Update local state safely
      setAllModelInfo((prev) =>
        prev.map((item) =>
          item.id === editModalData.id ? { ...item, ...updatePayload } : item,
        ),
      );

      toast.success("Model information updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update Error:", error);

      // 🌐 Network / server not reachable
      if (!error.response) {
        toast.error("Server not responding. Check your internet or backend.");
        return;
      }

      // 📛 Backend validation or API errors
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to update model information";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-400 my-10">
        Available Hight Width for{" "}
        <span className="text-teal-400">{modelNo}</span> Model
      </h1>
      {loading ? (
        <DisplaySpinner />
      ) : allModelInfo && allModelInfo.length === 0 ? (
        <p className="text-2xl font-semibold text-amber-500">
          No Model Information Available For This Model !!!
        </p>
      ) : (
        <div className="grid grid-cols-1 mx-1 md:mx-5 gap-4 text-center">
          <table className="border-collapse w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-purple-400">
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Model Name
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  PID
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Default Hight
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Default Width
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Max Hight
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Max Width
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Slide Mark
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Command
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Battery Mark
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Connected
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Printed Line
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Connectivity
                </th>
                <th className="border border-gray-400 px-4 py-2 text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allModelInfo?.map((element) => (
                <tr
                  className="border hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                  key={element.id}
                >
                  <td className="px-4 py-2 border">{element?.modelNo}</td>
                  <td className="px-4 py-2 border">{element?.pidNo}</td>
                  <td className="px-4 py-2 border">{element?.defaultHight}</td>
                  <td className="px-4 py-2 border">{element?.defaultWidth}</td>
                  <td className="px-4 py-2 border">{element?.maxHight}</td>
                  <td className="px-4 py-2 border">{element?.maxWidth}</td>
                  <td className="px-4 py-2 border">
                    {element?.sliderImageMark}
                  </td>
                  <td className="px-4 py-2 border">{element?.command}</td>
                  <td className="px-4 py-2 border">{element?.battery_mark}</td>
                  <td className="px-4 py-2 border">
                    {getConnectedLabel(element?.connected)}
                  </td>
                  <td className="px-4 py-2 border">
                    {getPrintedLineValue(element?.printedLine)}
                  </td>
                  <td className="px-4 py-2 border">
                    {getConnectivityLabel(element?.connectivity)}
                  </td>
                  <td className="px-4 py-2 border-r flex justify-evenly">
                    <MdEdit
                      onClick={() => handleToEdit(element)}
                      className="text-blue-500 hover:cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => handleToDelete(element.id)}
                      className="text-red-500 hover:cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mx-1 md:mx-5 mt-12 mb-10">
        <form
          onSubmit={handleModelConfigSubmit}
          className="w-full max-w-4xl mx-auto bg-white shadow rounded-xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-center text-[#004368]">
            Add Model Device Config
          </h2>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Model Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-100 px-4 py-2 border rounded-md text-slate-700 cursor-not-allowed"
              value={modelNo}
              readOnly
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Device Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#004368]"
              value={modelConfigForm.deviceType}
              onChange={(e) =>
                setModelConfigForm({
                  ...modelConfigForm,
                  deviceType: e.target.value,
                })
              }
            >
              <option value="">Select Device Type</option>
              {getDeviceTypeOptions().map((deviceType) => (
                <option key={deviceType} value={deviceType}>
                  {deviceType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-3 text-gray-700 font-medium">
              Connectivity
            </label>
            {getModelConfigConnectivityOptions(modelConfigForm.connectivity)
              .length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {getModelConfigConnectivityOptions(
                  modelConfigForm.connectivity,
                ).map((item) => (
                  <label
                    key={item}
                    className="inline-flex items-center gap-2 text-sm text-gray-600"
                  >
                    <input
                      type="radio"
                      name="modelConfigConnectivity"
                      value={item}
                      checked={modelConfigForm.connectivity === item}
                      onChange={handleModelConfigConnectivityChange}
                      className="accent-[#004368] bg-white"
                    />
                    {item}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No connectivity available.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Printed Line
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full bg-white px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#004368]"
                value={modelConfigForm.printedLine}
                onChange={(e) =>
                  setModelConfigForm({
                    ...modelConfigForm,
                    printedLine: e.target.value,
                  })
                }
                placeholder="Enter Printed Line"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Buffer Limit
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full bg-white px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#004368]"
                value={modelConfigForm.bufferLimit}
                onChange={(e) =>
                  setModelConfigForm({
                    ...modelConfigForm,
                    bufferLimit: e.target.value,
                  })
                }
                placeholder="Enter Buffer Limit"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#004368] hover:bg-blue-800 text-white font-semibold py-2 px-10 rounded-lg transition duration-300 disabled:opacity-60"
              disabled={configSubmitting}
            >
              {configSubmitting ? "Saving..." : "Add Device Config"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-[#004368] mb-5">
            Model Device Config List
          </h2>
          {configLoading ? (
            <DisplaySpinner />
          ) : modelDeviceConfigs.length === 0 ? (
            <p className="text-lg font-semibold text-amber-500">
              No device config available for this model.
            </p>
          ) : (
            <table className="border-collapse w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-400 to-purple-400">
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    ID
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Model Name
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Device Type
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Connectivity
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Printed Line
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Buffer Limit
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelDeviceConfigs.map((config) => (
                  <tr
                    className="border hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                    key={config.id}
                  >
                    <td className="px-4 py-2 border">{config.id}</td>
                    <td className="px-4 py-2 border">{config.modelName}</td>
                    <td className="px-4 py-2 border">{config.deviceType}</td>
                    <td className="px-4 py-2 border">
                      {getConnectivityLabel(config.connectivity)}
                    </td>
                    <td className="px-4 py-2 border">
                      {getPrintedLineValue(config.printedLine)}
                    </td>
                    <td className="px-4 py-2 border">
                      {config.bufferLimit ?? ""}
                    </td>
                    <td className="px-4 py-2 border-r flex justify-evenly">
                      <MdEdit
                        onClick={() => handleConfigEdit(config)}
                        className="text-blue-500 hover:cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => handleConfigDelete(config.id)}
                        className="text-red-500 hover:cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[88vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-5 py-4">
              <h2 className="text-lg font-bold text-[#004368]">{`Edit PID ${editModalData?.pidNo} Information`}</h2>
            </div>

            <div className="space-y-3 px-5 py-4">
              <div>
              <label className="block text-gray-700 font-medium mb-1">
                Model No
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-100 text-slate-700 cursor-not-allowed"
                type="text"
                value={editModalData?.modelNo || ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                PID
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-100 text-slate-700 cursor-not-allowed"
                type="text"
                value={editModalData?.pidNo || ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Default Height
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.defaultHight || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    defaultHight: e.target.value,
                  })
                }
                placeholder="Enter Default Height"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Default Width
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.defaultWidth || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    defaultWidth: e.target.value,
                  })
                }
                placeholder="Enter Default Width"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Max Height
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.maxHight || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    maxHight: e.target.value,
                  })
                }
                placeholder="Enter Max Height"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Max Width
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.maxWidth || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    maxWidth: e.target.value,
                  })
                }
                placeholder="Enter Max Width"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Slider Image Mark
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="text"
                value={editModalData?.sliderImageMark || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    sliderImageMark: e.target.value,
                  })
                }
                placeholder="Enter Slider Image Mark"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Command
              </label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="text"
                value={editModalData?.command || ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    command: e.target.value,
                  })
                }
                placeholder="Enter Command"
              />
            </div>

            {/* Battery Mark */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Battery Mark (V)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full border p-2 rounded bg-gray-50"
                value={editModalData?.battery_mark ?? 0}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    battery_mark: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Connected
              </label>
              <select
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                value={editModalData?.connected ?? ""}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    connected: parseConnectedValue(e.target.value),
                  })
                }
              >
                {connectedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Printed Line
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="printedLine"
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                value={getPrintedLineValue(editModalData?.printedLine)}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    printedLine: e.target.value,
                  })
                }
                placeholder="Enter Printed Line"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Connectivity
              </label>
              {getEditConnectivityOptions().length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {getEditConnectivityOptions().map((item) => (
                    <label
                      key={item}
                      className="inline-flex items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={getConnectivityValue(
                          editModalData?.connectivity,
                        ).includes(item)}
                        onChange={handleConnectivityChange}
                        className="accent-[#004368] bg-white"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No connectivity available.
                </p>
              )}
            </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-slate-800 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
          <form
            onSubmit={handleConfigUpdate}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[88vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-5 py-4">
              <h2 className="text-lg font-bold text-[#004368]">
                Edit Model Device Config
              </h2>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Model Name
                </label>
                <input
                  className="w-full border p-2 rounded bg-gray-100 text-slate-700 cursor-not-allowed"
                  type="text"
                  value={editConfigData?.modelName || modelNo}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Device Type
                </label>
                <select
                  className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                  value={editConfigData?.deviceType || ""}
                  onChange={(e) =>
                    setEditConfigData({
                      ...editConfigData,
                      deviceType: e.target.value,
                    })
                  }
                >
                  <option value="">Select Device Type</option>
                  {Array.from(
                    new Set([
                      ...getDeviceTypeOptions(),
                      editConfigData?.deviceType,
                    ].filter(Boolean)),
                  ).map((deviceType) => (
                    <option key={deviceType} value={deviceType}>
                      {deviceType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Connectivity
                </label>
                {getModelConfigConnectivityOptions(editConfigData?.connectivity)
                  .length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {getModelConfigConnectivityOptions(
                      editConfigData?.connectivity,
                    ).map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-gray-600"
                      >
                        <input
                          type="radio"
                          name="editModelConfigConnectivity"
                          value={item}
                          checked={editConfigData?.connectivity === item}
                          onChange={handleEditConfigConnectivityChange}
                          className="accent-[#004368] bg-white"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No connectivity available.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Printed Line
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                  value={getPrintedLineValue(editConfigData?.printedLine)}
                  onChange={(e) =>
                    setEditConfigData({
                      ...editConfigData,
                      printedLine: e.target.value,
                    })
                  }
                  placeholder="Enter Printed Line"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Buffer Limit
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                  value={editConfigData?.bufferLimit ?? ""}
                  onChange={(e) =>
                    setEditConfigData({
                      ...editConfigData,
                      bufferLimit: e.target.value,
                    })
                  }
                  placeholder="Enter Buffer Limit"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-slate-800 transition disabled:opacity-60"
                disabled={configSubmitting}
              >
                {configSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setEditConfigData(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShowHightWidth;
