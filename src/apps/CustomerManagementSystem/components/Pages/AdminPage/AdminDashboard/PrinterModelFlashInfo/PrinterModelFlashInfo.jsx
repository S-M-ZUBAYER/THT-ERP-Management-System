import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdDownload,
  MdEdit,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import axios from "axios";
import DisplaySpinner from "../../../../Shared/Loading/DisplaySpinner";

const BASE_URL = "https://grozziieget.zjweiting.com:8033";
const EMPTY_FORM = {
  modelName: "",
  fileName: "",
  expectedSha256: "",
  releaseNote: "",
  file: null,
};

const formatFileSize = (bytes) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size <= 0) {
    return "-";
  }

  const units = ["Bytes", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

const getFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  return filePath.startsWith("/")
    ? `${BASE_URL}${filePath}`
    : `${BASE_URL}/${filePath}`;
};

const getApiMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getModelName = (model) => {
  if (typeof model === "string") {
    return model;
  }

  return model?.modelName || model?.name || "";
};

const PrinterModelFlashInfo = () => {
  const [flashInfoList, setFlashInfoList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [searchModelName, setSearchModelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFlashInfoList = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${BASE_URL}/tht/printerModelFlashInfo/list`,
      );
      setFlashInfoList(response.data?.result || []);
    } catch (apiError) {
      const message = getApiMessage(apiError, "Failed to load flash info list");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tht/printerModelFlashInfo/modelList`,
      );
      const uniqueModelNames = Array.from(
        new Set(
          (response.data?.result || [])
            .map((model) => getModelName(model).trim())
            .filter(Boolean),
        ),
      );
      setModelList(uniqueModelNames);
    } catch (apiError) {
      console.error("Failed to load printer flash model list:", apiError);
    }
  };

  useEffect(() => {
    fetchFlashInfoList();
    fetchModelList();
  }, []);

  const filteredFlashInfoList = useMemo(() => {
    const searchValue = searchModelName.trim().toLowerCase();

    if (!searchValue) {
      return flashInfoList;
    }

    return flashInfoList.filter((item) =>
      (item.modelName || "").toLowerCase().includes(searchValue),
    );
  }, [flashInfoList, searchModelName]);

  const resetAddForm = () => {
    setAddForm(EMPTY_FORM);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetAddForm();
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditForm(EMPTY_FORM);
  };

  const appendTextField = (formData, fieldName, value) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      formData.append(fieldName, trimmedValue);
      return true;
    }

    return false;
  };

  const handleAddInputChange = (event) => {
    const { name, value } = event.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFileChange = (event) => {
    setAddForm((prev) => ({ ...prev, file: event.target.files?.[0] || null }));
  };

  const handleEditFileChange = (event) => {
    setEditForm((prev) => ({ ...prev, file: event.target.files?.[0] || null }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    if (!addForm.modelName.trim()) {
      toast.error("Model Name is required");
      return;
    }

    if (!addForm.file) {
      toast.error("File is required");
      return;
    }

    const formData = new FormData();
    formData.append("modelName", addForm.modelName.trim());
    formData.append("file", addForm.file);
    appendTextField(formData, "fileName", addForm.fileName);
    appendTextField(formData, "expectedSha256", addForm.expectedSha256);
    appendTextField(formData, "releaseNote", addForm.releaseNote);

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/tht/printerModelFlashInfo/add`,
        formData,
      );
      toast.success(response.data?.message || "Flash info added successfully");
      closeAddModal();
      await fetchFlashInfoList();
      await fetchModelList();
    } catch (apiError) {
      toast.error(getApiMessage(apiError, "Failed to add flash info"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditTarget(item);
    setEditForm({
      modelName: item.modelName || "",
      fileName: item.fileName || "",
      expectedSha256: item.expectedSha256 || "",
      releaseNote: item.releaseNote || "",
      file: null,
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!editTarget?.id) {
      toast.error("Flash info id is missing");
      return;
    }

    const formData = new FormData();
    let hasChangedField = false;

    if (
      editForm.modelName.trim() &&
      editForm.modelName.trim() !== (editTarget.modelName || "")
    ) {
      formData.append("modelName", editForm.modelName.trim());
      hasChangedField = true;
    }

    if (
      editForm.fileName.trim() &&
      editForm.fileName.trim() !== (editTarget.fileName || "")
    ) {
      formData.append("fileName", editForm.fileName.trim());
      hasChangedField = true;
    }

    if (
      editForm.expectedSha256.trim() &&
      editForm.expectedSha256.trim() !== (editTarget.expectedSha256 || "")
    ) {
      formData.append("expectedSha256", editForm.expectedSha256.trim());
      hasChangedField = true;
    }

    if (
      editForm.releaseNote.trim() &&
      editForm.releaseNote.trim() !== (editTarget.releaseNote || "")
    ) {
      formData.append("releaseNote", editForm.releaseNote.trim());
      hasChangedField = true;
    }

    if (editForm.file) {
      formData.append("file", editForm.file);
      hasChangedField = true;
    }

    if (!hasChangedField) {
      toast.error("Please change at least one field or upload a file");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/tht/printerModelFlashInfo/update/${editTarget.id}`,
        formData,
      );
      toast.success(
        response.data?.message || "Flash info updated successfully",
      );
      closeEditModal();
      await fetchFlashInfoList();
      await fetchModelList();
    } catch (apiError) {
      toast.error(getApiMessage(apiError, "Failed to update flash info"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.delete(
        `${BASE_URL}/tht/printerModelFlashInfo/delete/${deleteTarget.id}`,
      );
      toast.success(
        response.data?.message || "Flash info deleted successfully",
      );
      setDeleteTarget(null);
      await fetchFlashInfoList();
      await fetchModelList();
    } catch (apiError) {
      toast.error(getApiMessage(apiError, "Failed to delete flash info"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-left">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-[#004368]">
            Printer Model Flash Info
          </h1>
          <p className="mt-1 block text-left text-sm text-gray-500">
            Manage flash files by printer model.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchFlashInfoList}
            className="inline-flex items-center gap-2 rounded bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            <MdRefresh className="text-lg" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-[#004368] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
          >
            <MdAdd className="text-lg" />
            Add Flash Info
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <MdSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          <input
            type="text"
            list="printer-flash-models"
            value={searchModelName}
            onChange={(event) => setSearchModelName(event.target.value)}
            className="w-full rounded border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004368]"
            placeholder="Search by model name"
          />
          <datalist id="printer-flash-models">
            {modelList.map((modelName) => (
              <option key={modelName} value={modelName} />
            ))}
          </datalist>
        </div>
        <button
          type="button"
          onClick={() => setSearchModelName("")}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Clear Filter
        </button>
      </div>

      {loading ? (
        <DisplaySpinner />
      ) : error ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-5 text-red-700">
          {error}
        </div>
      ) : filteredFlashInfoList.length === 0 ? (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-8 text-center text-amber-700">
          No printer model flash info found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-purple-400 text-white">
                <th className="border border-gray-300 px-3 py-2">ID</th>
                <th className="border border-gray-300 px-3 py-2">
                  Model Name
                </th>
                <th className="border border-gray-300 px-3 py-2">File Name</th>
                <th className="border border-gray-300 px-3 py-2">File Size</th>
                <th className="border border-gray-300 px-3 py-2">SHA256</th>
                <th className="border border-gray-300 px-3 py-2">
                  Release Note
                </th>
                <th className="border border-gray-300 px-3 py-2">
                  File Link
                </th>
                <th className="border border-gray-300 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlashInfoList.map((item) => {
                const fileUrl = getFileUrl(item.filePath);

                return (
                  <tr
                    key={item.id}
                    className="border hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                  >
                    <td className="border px-3 py-2">{item.id}</td>
                    <td className="border px-3 py-2">{item.modelName}</td>
                    <td className="border px-3 py-2">{item.fileName || "-"}</td>
                    <td className="border px-3 py-2">
                      {formatFileSize(item.expectedSizeBytes)}
                    </td>
                    <td className="max-w-xs break-all border px-3 py-2">
                      {item.expectedSha256 || "-"}
                    </td>
                    <td className="max-w-xs border px-3 py-2">
                      {item.releaseNote || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1 text-[#004368] hover:underline"
                        >
                          <MdDownload className="text-lg" />
                          Download
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#004368]">
                Add Flash Info
              </h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="text-gray-500 hover:text-gray-800"
                title="Close"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Model Name
                </label>
                <input
                  type="text"
                  name="modelName"
                  value={addForm.modelName}
                  onChange={handleAddInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleAddFileChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  File Name
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={addForm.fileName}
                  onChange={handleAddInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Expected SHA256
                </label>
                <input
                  type="text"
                  name="expectedSha256"
                  value={addForm.expectedSha256}
                  onChange={handleAddInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Release Note
                </label>
                <textarea
                  name="releaseNote"
                  value={addForm.releaseNote}
                  onChange={handleAddInputChange}
                  className="min-h-24 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAddModal}
                className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#004368] px-4 py-2 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#004368]">
                Edit Flash Info
              </h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-800"
                title="Close"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              Current file:{" "}
              {getFileUrl(editTarget.filePath) ? (
                <a
                  href={getFileUrl(editTarget.filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="font-semibold text-[#004368] hover:underline"
                >
                  {editTarget.fileName || "Download file"}
                </a>
              ) : (
                editTarget.fileName || "-"
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Model Name
                </label>
                <input
                  type="text"
                  name="modelName"
                  value={editForm.modelName}
                  onChange={handleEditInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Replace File
                </label>
                <input
                  type="file"
                  onChange={handleEditFileChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  File Name
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={editForm.fileName}
                  onChange={handleEditInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Expected SHA256
                </label>
                <input
                  type="text"
                  name="expectedSha256"
                  value={editForm.expectedSha256}
                  onChange={handleEditInputChange}
                  className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Release Note
                </label>
                <textarea
                  name="releaseNote"
                  value={editForm.releaseNote}
                  onChange={handleEditInputChange}
                  className="min-h-24 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-[#004368]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#004368] px-4 py-2 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#004368]">
              Delete Flash Info
            </h2>
            <p className="mt-3 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteTarget.fileName || deleteTarget.modelName}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isDeleting}
              >
                <MdDelete className="text-lg" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterModelFlashInfo;
