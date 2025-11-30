import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const SettingPrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-32">
        <p className="text-7xl font-bold text-fuchsia-900">L</p>
        <div className="w-10 h-10 border-8 border-dashed rounded-full animate-spin mt-5 border-blue-400"></div>
        <p className="text-7xl font-bold text-fuchsia-900">ading....</p>
      </div>
    );
  }

  if (!user?.superAdmin && !user?.leader) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default SettingPrivateRoute;
