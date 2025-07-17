import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, loading }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    console.log("private route");
    console.log(user);


    if (loading) {
        return (
            <div className="flex justify-center items-center mt-32">
                <p className="text-7xl font-bold text-fuchsia-900">L</p>
                <div className="w-10 h-10 border-8 border-dashed rounded-full animate-spin mt-5 border-blue-400"></div>
                <p className="text-7xl font-bold text-fuchsia-900">ading....</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
