import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";
import DisplaySpinner from "../../../Shared/Loading/DisplaySpinner";

const AllUsers = () => {
  //create useState for the user and update
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmAdminUser, setConfirmAdminUser] = useState(null);
  const [confirmChatBotAdminUser, setConfirmChatBotAdminUser] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isTruthyPermission = (value) =>
    value === true || value === 1 || value === "1" || value === "true";
  const canManageChatBotAdmin =
    isTruthyPermission(currentUser?.chatBotAdmin) ||
    isTruthyPermission(currentUser?.chtBotAdmin);

  //start the part to get all the users from database

  useEffect(() => {
    // This code will run when the component mounts
    axios
      .get("https://grozziieget.zjweiting.com:8033/tht/allUsers")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  //create a function to delete a user from the frontend and database both side
  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/users/delete/${userId}`,
      );
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };
  const openEditModal = (user) => {
    setEditingUser(user);
  };

  //create a function to update a user from the frontend and database both side
  const updateUser = async (userId, editingUser) => {
    try {
      const response = await axios.put(
        `https://grozziieget.zjweiting.com:8033/tht/users/update/${userId}`,
        editingUser,
      );
      console.log(response);

      toast.success("user information updated successfully");
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      toast.error("Error updating user:", error);
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };
  const saveUser = (userId, updatedUser) => {
    updateUser(userId, updatedUser);
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
    setEditingUser(null);
  };

  //create a function to update a user from the frontend and database both side
  const updateUserAdminPermission = async (user) => {
    const nextIsAdmin = isTruthyPermission(user?.isAdmin) ? false : true;

    try {
      const response = await axios.put(
        `https://grozziieget.zjweiting.com:8033/tht/users/update/admin/${user.id}`,
        nextIsAdmin,
      );

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id ? { ...item, isAdmin: nextIsAdmin } : item,
        ),
      );
      setConfirmAdminUser(null);

      response?.statusText &&
        toast.success(
          nextIsAdmin
            ? "Admin permission updated successfully"
            : "Admin permission removed successfully",
        );
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      console.error("Error updating admin permission:", error);
      toast.error("Error updating admin permission");
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };

  const updateUserToChatBotAdmin = async (user) => {
    const baseUrl = "https://grozziieget.zjweiting.com:8033";
    const nextChatBotAdmin = isTruthyPermission(user?.chatBotAdmin) ? 0 : 1;

    try {
      await Promise.all([
        axios.put(`${baseUrl}/tht/users/update/chatBotManagement/${user.id}`, {
          chatBotManagement: nextChatBotAdmin,
        }),
        axios.put(`${baseUrl}/tht/users/update/chatBotAdmin/${user.id}`, {
          chatBotAdmin: nextChatBotAdmin,
        }),
      ]);

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                chatBotManagement: nextChatBotAdmin,
                chatBotAdmin: nextChatBotAdmin,
              }
            : item,
        ),
      );
      setConfirmChatBotAdminUser(null);
      toast.success(
        nextChatBotAdmin
          ? "ChatBot admin permission updated successfully"
          : "ChatBot admin permission removed successfully",
      );
    } catch (error) {
      console.error("Error updating ChatBot admin:", error);
      toast.error("Failed to update ChatBot admin permission");
    }
  };
  // const saveUser = (userId,updatedUser) => {
  //   updateUser(userId, updatedUser);
  //   setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  //   setEditingUser(null);
  // };
  const updateUserRole = async (email, role) => {
    console.log(email, role);
    try {
      const apiUrl = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/migrate/email`;
      const requestData = {
        userEmail: email,
        role: role,
      };

      const response = await axios.put(apiUrl, requestData);
      console.log("User role updated successfully:", response.data);
      toast.success(`User role change to the ${role} updated successfully`);
      // Handle success or do something with the response
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Error updating user role`);
      // Handle error
    }
  };

  // Call the function with the user object

  const ChangeChattingUserRole = (user) => {
    updateUserRole(user.email, "customer_service");
  };
  const ChangeIntoGeneralRole = (user) => {
    updateUserRole(user.email, "user");
  };

  const handleToClose = () => {
    setEditingUser(null);
  };

  return (
    <div className="text-gray-700 font-normal">
      <div className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-bold text-[#004368]">All Users</h2>
          <p className="text-sm text-slate-500">
            Manage account access and admin permissions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-[#004368] text-white">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Designation
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  Admin
                </th>
                {canManageChatBotAdmin && (
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    ChatBot Admin
                  </th>
                )}
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                  Edit
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={canManageChatBotAdmin ? 7 : 6}
                    className="px-5 py-10"
                  >
                    <DisplaySpinner></DisplaySpinner>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {user.designation || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {isTruthyPermission(user?.isAdmin) ? (
                        <button
                          onClick={() => setConfirmAdminUser(user)}
                          className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                        >
                          Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmAdminUser(user)}
                          className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-200"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                    {canManageChatBotAdmin && (
                      <td className="px-5 py-4">
                        {isTruthyPermission(user?.chatBotAdmin) ? (
                          <button
                            onClick={() => setConfirmChatBotAdminUser(user)}
                            className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                          >
                            ChatBot Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmChatBotAdminUser(user)}
                            className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200"
                          >
                            Make ChatBot Admin
                          </button>
                        )}
                      </td>
                    )}
                    <td className="px-5 py-4 text-center">
                      <button
                        className=" "
                        onClick={() => openEditModal(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil size={17} strokeWidth={2.2} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        className=""
                        onClick={() => setConfirmDeleteUser(user)}
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 size={17} strokeWidth={2.2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal part start from here to update a user information */}
      {editingUser && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8">
            <div className=" flex justify-end">
              <button onClick={() => handleToClose()}>
                <IoMdCloseCircle className=" text-4xl   " />
              </button>
            </div>
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="email"
              placeholder="Email"
              readOnly
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editingUser.phone}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Designation"
              value={editingUser.designation}
              onChange={(e) =>
                setEditingUser({ ...editingUser, designation: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Language"
              value={editingUser.language}
              onChange={(e) =>
                setEditingUser({ ...editingUser, language: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Country"
              value={editingUser.country}
              onChange={(e) =>
                setEditingUser({ ...editingUser, country: e.target.value })
              }
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => saveUser(editingUser.id, editingUser)}
            >
              Save
            </button>

            {/* Change the user role */}
            <div className="my-5">
              <h2 className=" text-2xl font-bold mb-8 mt-12 text-orange-400">
                Change the user role
              </h2>
              <button
                className=" font-semibold text-black bg-gradient-to-r from-green-300 to-yellow-500  px-4 py-2 rounded-full focus:outline-none"
                onClick={() => ChangeIntoGeneralRole(editingUser)}
              >
                General
              </button>

              <button
                className="font-semibold text-black bg-gradient-to-r from-red-300 to-red-500 px-4 py-2 rounded-full focus:outline-none ml-2"
                onClick={() => ChangeChattingUserRole(editingUser)}
              >
                Chatting
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {isTruthyPermission(confirmAdminUser?.isAdmin)
                ? "Remove Admin Permission?"
                : "Make Admin?"}
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              {isTruthyPermission(confirmAdminUser?.isAdmin)
                ? `This will cancel admin permission for ${confirmAdminUser.name}.`
                : `This will enable admin permission for ${confirmAdminUser.name}.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => setConfirmAdminUser(null)}
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 font-semibold text-white ${
                  isTruthyPermission(confirmAdminUser?.isAdmin)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => updateUserAdminPermission(confirmAdminUser)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmChatBotAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {isTruthyPermission(confirmChatBotAdminUser?.chatBotAdmin)
                ? "Remove ChatBot Admin?"
                : "Make ChatBot Admin?"}
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              {isTruthyPermission(confirmChatBotAdminUser?.chatBotAdmin)
                ? `This will cancel ChatBot Management and ChatBot Admin permission for ${confirmChatBotAdminUser.name}.`
                : `This will enable ChatBot Management and ChatBot Admin permission for ${confirmChatBotAdminUser.name}.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => setConfirmChatBotAdminUser(null)}
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 font-semibold text-white ${
                  isTruthyPermission(confirmChatBotAdminUser?.chatBotAdmin)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() =>
                  updateUserToChatBotAdmin(confirmChatBotAdminUser)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">Delete User?</h2>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete {confirmDeleteUser.name}? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => setConfirmDeleteUser(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                onClick={async () => {
                  await deleteUser(confirmDeleteUser.id);
                  setConfirmDeleteUser(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
