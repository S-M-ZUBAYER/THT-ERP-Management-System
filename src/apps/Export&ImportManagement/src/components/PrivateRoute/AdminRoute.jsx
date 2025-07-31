import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const location = useLocation();
  const foundUser = JSON.parse(localStorage.getItem("user")); // Get userId from localStore

  // If no userId is found, or user is not admin, redirect to home
  if (!foundUser) {
    return (
      <Navigate to="/export-import/login" state={{ from: location }} replace />
    );
  } else if (foundUser.admin) {
    // If user is an admin, allow access to the protected route
    return <Outlet />;
  } else {
    toast.error("You don't have permission to access this route");
    return <Navigate to="/export-import`" state={{ from: location }} replace />;
  }
};

export default AdminRoute;
