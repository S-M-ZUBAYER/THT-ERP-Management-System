import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addMachineVersion,
  deleteMachineVersion,
  getMachineVersions,
  updateMachineVersion,
} from "../utils/attendanceMachineVersionApi";

const emptyForm = {
  modelName: "",
  region: "EN",
  versionCategory: "",
  sliderImageMark: "",
};

const MachineVersionManager = ({ config }) => {
  const [versions, setVersions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingVersion, setEditingVersion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredVersions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return versions;

    return versions.filter((version) =>
      [
        version?.modelName,
        version?.region,
        version?.versionCategory,
        version?.sliderImageMark,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchTerm, versions]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await getMachineVersions(config);
      setVersions(data);
    } catch (error) {
      toast.error(`Failed to load ${config.label} versions`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData(emptyForm);
    setEditingVersion(null);
    setSearchTerm("");
    loadVersions();
  }, [config.key]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingVersion(null);
  };

  const validateForm = () => {
    if (!formData.modelName.trim()) {
      toast.error("Please enter model name");
      return false;
    }
    if (!formData.region.trim()) {
      toast.error("Please select region");
      return false;
    }
    if (!formData.versionCategory.trim()) {
      toast.error("Please enter version category");
      return false;
    }
    if (!formData.sliderImageMark.trim()) {
      toast.error("Please enter slider image mark");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      modelName: formData.modelName.trim(),
      region: formData.region.trim(),
      versionCategory: formData.versionCategory.trim(),
      sliderImageMark: formData.sliderImageMark.trim(),
    };

    setSaving(true);
    try {
      if (editingVersion) {
        await updateMachineVersion(config, editingVersion.id, payload);
        toast.success(`${config.label} version updated successfully`);
      } else {
        await addMachineVersion(config, payload);
        toast.success(`${config.label} version added successfully`);
      }
      resetForm();
      loadVersions();
    } catch (error) {
      toast.error(`Failed to save ${config.label} version`);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (version) => {
    setEditingVersion(version);
    setFormData({
      modelName: version?.modelName || "",
      region: version?.region || "EN",
      versionCategory: version?.versionCategory || "",
      sliderImageMark: version?.sliderImageMark || "",
    });
  };

  const handleDelete = async (version) => {
    const shouldDelete = window.confirm(
      `Delete ${version?.modelName || "this version"}?`,
    );

    if (!shouldDelete) return;

    setDeletingId(version.id);
    try {
      await deleteMachineVersion(config, version.id);
      toast.success(`${config.label} version deleted successfully`);
      if (editingVersion?.id === version.id) {
        resetForm();
      }
      loadVersions();
    } catch (error) {
      toast.error(`Failed to delete ${config.label} version`);
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#004368]">
              {config.label} Versions
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Total versions: {versions.length}
            </p>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="p-3 bg-white text-black border border-gray-300 rounded w-full md:w-80"
            placeholder="Search model, region, category..."
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6"
        >
          <section>
            <label className="block font-medium text-gray-700 mb-2">
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              className="p-3 bg-white text-black border border-gray-300 rounded w-full"
              placeholder="Enter model name"
            />
          </section>

          <section>
            <label className="block font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="p-3 bg-white text-black border border-gray-300 rounded w-full"
            >
              <option value="EN">EN</option>
              <option value="ZH">ZH</option>
            </select>
          </section>

          <section>
            <label className="block font-medium text-gray-700 mb-2">
              Version Category
            </label>
            <input
              type="text"
              name="versionCategory"
              value={formData.versionCategory}
              onChange={handleInputChange}
              className="p-3 bg-white text-black border border-gray-300 rounded w-full"
              placeholder="Enter version category"
            />
          </section>

          <section>
            <label className="block font-medium text-gray-700 mb-2">
              Slider Image Mark
            </label>
            <input
              type="text"
              name="sliderImageMark"
              value={formData.sliderImageMark}
              onChange={handleInputChange}
              className="p-3 bg-white text-black border border-gray-300 rounded w-full"
              placeholder="Enter slider image mark"
            />
          </section>

          <div className="md:col-span-2 flex justify-end gap-3">
            {editingVersion && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 font-medium bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className={`px-6 py-3 font-medium text-white rounded transition-colors ${
                saving ? "bg-gray-400" : "bg-[#004368] hover:bg-blue-700"
              }`}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingVersion
                  ? "Update Version"
                  : "Add Version"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004368]"></div>
          </div>
        ) : filteredVersions.length === 0 ? (
          <p className="text-center text-red-400 my-10">
            No version data available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#004368] text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Model Name</th>
                  <th className="p-3 text-left">Region</th>
                  <th className="p-3 text-left">Version Category</th>
                  <th className="p-3 text-left">Slider Image Mark</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVersions.map((version) => (
                  <tr
                    key={version.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-700">{version.id}</td>
                    <td className="p-3 text-gray-700">{version.modelName}</td>
                    <td className="p-3 text-gray-700">{version.region}</td>
                    <td className="p-3 text-gray-700">
                      {version.versionCategory}
                    </td>
                    <td className="p-3 text-gray-700">
                      {version.sliderImageMark}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(version)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(version)}
                          className={`px-4 py-2 text-white rounded transition ${
                            deletingId === version.id
                              ? "bg-gray-400"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                          disabled={deletingId === version.id}
                        >
                          {deletingId === version.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineVersionManager;
