import { Dialog } from "@headlessui/react";

export default function EditProfileModal({
  showEditModal,
  setShowEditModal,
  formData,
  handleChange,
  handleUpdateUser,
}) {
  return (
    <Dialog
      open={showEditModal}
      onClose={() => setShowEditModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Dialog.Panel className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Profile
        </Dialog.Title>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData?.image}
            alt="User"
            className="w-28 h-28 rounded-full object-cover border border-blue-400 mb-2"
          />
          <p className="text-sm text-gray-500">Profile Picture</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={formData?.email || ""}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData?.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-medium text-gray-700">Country</label>
            <input
              name="country"
              value={formData?.country || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Language */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Language
            </label>
            <input
              name="language"
              value={formData?.language || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              name="designation"
              value={formData?.designation || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Department */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            {/* <select
              id="department"
              name="department" // important for handleChange to work
              value={formData?.department || ""} // bind to department
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Department</option>
              <option value="Customer Service Officer">
                Customer Service Officer
              </option>
              <option value="Sales">Sales</option>
              <option value="Research & Development">
                Research & Development
              </option>
              <option value="Accounts">Accounts</option>
            </select> */}
            <input
              value={formData?.department}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          {/* Leader (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Leader</label>
            <input
              value={formData?.leader ? "True" : "False"}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          {/* Super Admin (editable checkbox) */}
          {/* <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Super Admin
            </label>
            <input
              type="checkbox"
              name="superAdmin"
              checked={!!formData?.superAdmin}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "superAdmin",
                    value: e.target.checked ? 1 : 0,
                  },
                })
              }
              className="checkbox checkbox-primary"
            />
          </div> */}
        </form>

        {/* Permissions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700 pt-6">
          <p>
            <strong>isAdmin:</strong> {String(formData?.isAdmin)}
          </p>
          <p>
            <strong>thtManagement:</strong>{" "}
            {formData?.thtManagement === 1 ? "true" : "false"}
          </p>
          <p>
            <strong>taskManagement:</strong>{" "}
            {formData?.taskManagement === 1 ? "true" : "false"}
          </p>
          <p>
            <strong>wowomartManagement:</strong>{" "}
            {formData?.wowomartManagement === 1 ? "true" : "false"}
          </p>
          <p>
            <strong>ExportImportManagement:</strong>{" "}
            {formData?.ExportImportManagement === 1 ? "true" : "false"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-5 py-2.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdateUser}
            className="px-5 py-2.5 text-sm bg-[#004368] text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
