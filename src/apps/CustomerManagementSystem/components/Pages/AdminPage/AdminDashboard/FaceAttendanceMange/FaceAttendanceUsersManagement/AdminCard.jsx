// AdminCard.jsx
import React from "react";

const AdminCard = ({ admin }) => (
  <div className="text-center border rounded-lg p-4 bg-yellow-50 border-yellow-300 shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
    <p className="font-medium text-sm text-gray-800">{admin.adminName}</p>
    <p className="text-xs text-gray-500 truncate">{admin.adminEmail}</p>
    <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full font-semibold">
      Admin
    </span>
  </div>
);

export default AdminCard;
