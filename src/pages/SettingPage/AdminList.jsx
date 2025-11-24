import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // make sure you installed react-toastify
import { Trash, User } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const AdminList = ({
  activeTab,
  userData,
  setUserData,
  selectedUser,
  setSelectedUser,
  currentUser,
  searchTerm,
  setSearchTerm,
}) => {
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });

  const filtered =
    userData?.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // 🔹 Delete user function
  const handleDelete = async (userId) => {
    try {
      const res = await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/users/delete/${userId}`
      );

      if (res.status === 200) {
        toast.success("✅ User deleted successfully!");

        // ✅ Filter deleted user only from the current activeTab list
        setUserData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((u) => u.id !== userId),
        }));

        // Close modal
        setDeleteModal({ show: false, user: null });

        // If the deleted user was selected, clear it
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
      } else {
        toast.error("❌ Failed to delete user.");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Error deleting user.");
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl px-4 h-[1150px] overflow-y-auto relative">
      {/* 🔹 Sticky header section */}
      <div className="sticky top-0 bg-white z-10 pb-2 py-4">
        <h2 className="text-lg font-semibold mb-3 capitalize">
          {activeTab} list
        </h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((person, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(person)}
            className={`flex justify-between items-center gap-3 border rounded-xl p-2 transition cursor-pointer ${
              selectedUser?.email === person.email
                ? "bg-blue-50 border-blue-400"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden">
                {person.image ? (
                  <img
                    src={person.image}
                    alt="Img"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="w-full h-full text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{person.name}</p>
                <p className="text-sm text-gray-500">{person.email}</p>
              </div>
            </div>

            {/* 🔹 Delete button only visible for super admin */}
            {currentUser?.superAdmin === 1 &&
              currentUser?.email !== person.email && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({ show: true, user: person });
                  }}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  <Trash size={20} />
                </button>
              )}
          </div>
        ))}
      </div>

      {/* 🔹 Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-200 text-center">
            <div className="text-5xl text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteModal.user.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.user.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
