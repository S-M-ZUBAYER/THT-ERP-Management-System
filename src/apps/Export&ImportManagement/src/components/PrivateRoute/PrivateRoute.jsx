import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  // const [user,setUser] = useState()
  const user = JSON.parse(localStorage.getItem("values"));
  if (!user) {
    return (
      <Navigate to="/export-import/login" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
