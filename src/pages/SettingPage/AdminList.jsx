import React, { useState } from "react";

const AdminList = ({ activeTab, userData, selectedUser, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered =
    userData?.filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="bg-white shadow rounded-2xl p-4 h-[1118px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 capitalize">
        {activeTab} list
      </h2>
      <input
        type="text"
        placeholder="Search"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-3">
        {filtered.map((person, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(person)}
            className={`flex items-center gap-3 border rounded-xl p-2 transition cursor-pointer ${
              selectedUser?.email === person.email
                ? "bg-blue-50 border-blue-400"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
            <div>
              <p className="font-medium text-gray-800">{person.name}</p>
              <p className="text-sm text-gray-500">{person.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
