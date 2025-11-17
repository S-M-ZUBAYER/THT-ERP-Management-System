import React from "react";

const ConfirmModal = ({
  show,
  message,
  selectedUser,
  type = "confirm", // 'confirm' or 'info'
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center animate-fade-in">
        {/* Warning Icon */}
        <div className="text-5xl text-red-500 mb-4">⚠️</div>

        {/* Message */}
        <h2 className="text-lg font-semibold mb-2">{message}</h2>

        {/* Selected User Info */}
        {selectedUser && (
          <p className="mb-4 text-gray-700">
            <span className="font-medium">{selectedUser.name}</span> <br />
            <span className="text-sm">{selectedUser.email}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {type === "confirm" ? (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
