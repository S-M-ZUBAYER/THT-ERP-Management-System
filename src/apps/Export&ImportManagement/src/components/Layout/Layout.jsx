import React from "react";
import { useLocation } from "react-router-dom";
import Routers from "../../routers/Routers";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import DashboardSidebar from "../../pages/Dashboard/DashboardSidebar";

const Layout = () => {
  const location = useLocation();
  const isRootRoute =
    location.pathname === "/export-import" ||
    location.pathname === "/export-import/" ||
    location.pathname.includes("login") ||
    location.pathname.includes("signup");
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {isRootRoute ? (
          <main className="container mx-auto flex-grow">
            <Routers />
          </main>
        ) : (
          <div className="flex">
            <DashboardSidebar />
            <main className="container mx-auto flex-grow">
              <Routers />
            </main>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
