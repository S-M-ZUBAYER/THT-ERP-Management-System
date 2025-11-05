import { Dialog } from "@headlessui/react";

export default function PermissionModal({ show, onClose }) {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <Dialog.Title className="text-lg font-semibold text-gray-800 mb-3">
          Permission Denied
        </Dialog.Title>

        <p className="text-gray-600 mb-5">
          You don’t have permission to access this system.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
