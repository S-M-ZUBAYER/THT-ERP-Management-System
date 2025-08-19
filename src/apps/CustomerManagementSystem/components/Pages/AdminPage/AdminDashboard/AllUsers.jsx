import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { IoMdCloseCircle } from "react-icons/io";
import DisplaySpinner from '../../../Shared/Loading/DisplaySpinner';


const AllUsers = () => {

  //create useState for the user and update 
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);


  //start the part to get all the users from database

  useEffect(() => {
    // This code will run when the component mounts
    axios.get('https://grozziieget.zjweiting.com:8033/tht/allUsers')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);


  //create a function to delete a user from the frontend and database both side 
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://grozziieget.zjweiting.com:8033/tht/users/delete/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };
  const openEditModal = (user) => {
    setEditingUser(user);
  };



  //create a function to update a user from the frontend and database both side 
  const updateUser = async (userId, editingUser) => {
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/users/update/${userId}`, editingUser);
      toast.success("user information updated successfully");
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      toast.error('Error updating user:', error);
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };
  const saveUser = (userId, updatedUser) => {
    updateUser(userId, updatedUser);
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setEditingUser(null);
  };

  //create a function to update a user from the frontend and database both side 
  const updateUserToAdmin = async (userId) => {
    // setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    const isAdmin = true;
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/users/update/admin/${userId}`, isAdmin);
      setUsers(users.map((user) => {
        if (user?.id === userId) {
          user.isAdmin = "true";
        }
        return user;
      }))

      response?.statusText && toast.success("Make admin successfully");
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      toast.error('Error updating user To admin:', error);
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };
  // const saveUser = (userId,updatedUser) => {
  //   updateUser(userId, updatedUser);
  //   setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  //   setEditingUser(null);
  // };
  const updateUserRole = async (email, role) => {
    console.log(email, role)
    try {
      const apiUrl = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/migrate/email`;
      const requestData = {
        userEmail: email,
        role: role
      };

      const response = await axios.put(apiUrl, requestData);
      console.log('User role updated successfully:', response.data);
      toast.success(`User role change to the ${role} updated successfully`)
      // Handle success or do something with the response
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(`Error updating user role`)
      // Handle error
    }
  };

  // Call the function with the user object



  const ChangeChattingUserRole = (user) => {
    updateUserRole(user.email, "customer_service");
  }
  const ChangeIntoGeneralRole = (user) => {
    updateUserRole(user.email, "user");
  }

  const handleToClose = () => {
    setEditingUser(null);
  }

  return (
    <div className="text-gray-800">
      <table className="w-full mb-10">
        <thead className="bg-orange-200">
          <tr className="py-2">
            <th className="text-start pl-2 py-2">Name</th>
            <th className="text-start hidden md:block">Email</th>
            <th className="text-start hidden md:block">Phone</th>
            <th className="text-start">Designation</th>
            <th className="text-start">Language</th>
            <th className="text-start">Country</th>
            <th className="text-start">Admin</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading ?
            <div >
              <DisplaySpinner></DisplaySpinner>
            </div>
            :
            users.map((user) => (
              <tr key={user.id} className="my-5">
                <td className="text-start pl-2 py-2 font-semibold" >{user.name}</td>
                <td className="text-start hidden md:block">{user.email}</td>
                <td className="text-start hidden md:block">{user.phone}</td>
                <td className="text-start">{user.designation}</td>
                <td className="text-start">{user.language}</td>
                <td className="text-start">{user.country}</td>
                <td>
                  {
                    user?.isAdmin === "true" ?
                      <button className=" bg-yellow-300 rounded-tl-lg rounded-br-lg py-1 px-2">Admin</button>
                      :
                      <button onClick={() => updateUserToAdmin(user?.id)} className=" bg-red-400 rounded-tl-lg rounded-br-lg py-1 px-2">Make Admin</button>

                  }
                </td>
                <td>
                  <button className="text-blue-500" onClick={() => openEditModal(user)}>
                    <FiEdit></FiEdit>
                  </button>
                </td>
                <td>
                  <button className="text-red-500" onClick={() => deleteUser(user.id)}>
                    <RiDeleteBin7Line></RiDeleteBin7Line>
                  </button>
                </td>
              </tr>
            ))
          }

        </tbody>
      </table>



      {/* modal part start from here to update a user information */}
      {editingUser && (
        <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">

          <div className="bg-white p-8">
            <div className=" flex justify-end">
              <button 
                onClick={() => handleToClose()}
              >
               <IoMdCloseCircle className=" text-4xl   "/>
              </button>
            </div>
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="email"
              placeholder="Email"
              readOnly
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editingUser.phone}
              onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Designation"
              value={editingUser.designation}
              onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Language"
              value={editingUser.language}
              onChange={(e) => setEditingUser({ ...editingUser, language: e.target.value })}
              className="mb-2 px-4 py-2 border border-gray-300 bg-white rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Country"
              value={editingUser.country}
              onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
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
              <h2 className=" text-2xl font-bold mb-8 mt-12 text-orange-400">Change the user role</h2>
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
    </div>
  );
};

export default AllUsers;
