import React from "react";

const RoleSelector = ({
  user,
  confirmModal,
  setConfirmModal,
  loading,
  handleUpdateRole,
  selectedUser,
}) => {
  return (
    <>
      {/* ✅ Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%]  max-w-md shadow-xl">
            <div className="text-5xl text-red-500 mb-4 flex justify-center">
              ⚠️
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex justify-center">
              Confirm Role Change
            </h2>
            <p className="text-gray-600 mb-4 mx-auto text-center">
              Are you sure you want to{" "}
              <span className="font-semibold text-yellow-800">
                {confirmModal.role === "leader"
                  ? selectedUser?.leader === 0
                    ? "make"
                    : "remove"
                  : confirmModal.role === "admin"
                  ? selectedUser?.superAdmin === 0
                    ? "make"
                    : "remove"
                  : ""}
              </span>{" "}
              <span className="font-semibold text-gray-800">
                {user?.name || "this user"}
              </span>{" "}
              ({user?.email || "no email"}) as{" "}
              <span className="text-[#004368] font-semibold">
                {confirmModal.role === "admin" ? "an" : "a"} {confirmModal.role}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, role: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRole(confirmModal.role)}
                className="px-4 py-2 rounded-lg bg-[#004368] text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoleSelector;
