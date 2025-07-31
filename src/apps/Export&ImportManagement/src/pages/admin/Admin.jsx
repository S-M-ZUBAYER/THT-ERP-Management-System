import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const override = {
    display: "block",
    margin: "25px auto",
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users"
        );
        setUsers(response.data);
        setUserLoading(false);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUserLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle "Make Admin" button click
  const handleMakeAdmin = async (user) => {
    const confirmAdmin = window.confirm(
      "Are you sure, you want to make this user admin"
    );
    if (confirmAdmin) {
      try {
        await axios.post(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users`,
          { ...user, admin: true }
        );
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? { ...u, admin: true } : u))
        );
        toast.success("User has been made admin successfully!");
      } catch {
        toast.error("Failed to make user admin");
      }
    }
  };

  // Handle "Edit" button click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewName(user.userName);
    setNewPassword(user.password);
    setIsModalOpen(true);
  };

  // Handle form submission in modal
  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users`,
        {
          ...selectedUser,
          userName: newName,
          password: newPassword,
          role: newRole,
        }
      );
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? { ...u, userName: newName, password: newPassword, role: newRole }
            : u
        )
      );
      toast.success("User details updated successfully!");
      setIsModalOpen(false); // Close modal
    } catch {
      toast.error("Failed to update user details");
    }
  };

  return (
    <div className="max-h-screen mb-6  overflow-y-auto custom-scrollbar">
      <h1 className="text-xl md:text-4xl mt-10 text-center font-bold text-violet-500 uppercase tracking-wide">
        User List
      </h1>
      {userLoading ? (
        <div className="">
          <ClipLoader
            color={"#36d7b7"}
            loading={userLoading}
            size={50}
            cssOverride={override}
          />
          <p className="text-center font-extralight text-xl text-green-400">
            Please wait ....
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-7 mx-[35px] md:mx-3">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-violet-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Admin</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-6">{user.userName}</td>
                  <td className="py-3 px-6">{user.userEmail}</td>
                  <td className="py-3 px-6">{user.role}</td>
                  <td className="py-3 px-6">
                    {user.admin ? "Admin" : "Not Admin"}
                  </td>
                  <td className="py-3 px-6 flex space-x-4">
                    {!user.admin && (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for editing user */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Edit User"
          className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto mt-20"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-cyan-600">
            Edit User
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={selectedUser.userEmail}
              readOnly
              className="w-full p-2 border rounded bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="" disabled>
                Select Role
              </option>{" "}
              {/* Placeholder option */}
              <option value="Commercial Manager">Commercial Manager</option>
              <option value="Finance">Finance</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleUpdateUser}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
