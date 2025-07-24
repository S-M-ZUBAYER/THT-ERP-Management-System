import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to get the current route
import Routers from "../../routers/Routers";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import DashboardSidebar from "../../pages/Dashboard/DashboardSidebar";

const Layout = () => {
  const location = useLocation(); // Get the current route
  const isRootRoute =
    location.pathname === "/export-import" ||
    location.pathname === "/export-import/" ||
    location.pathname.includes("login"); // Define the condition to check if we're on the main domain

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {isRootRoute ? (
          // Show only the Routers content when accessing the main domain
          <main className="container mx-auto flex-grow">
            <Routers />
          </main>
        ) : (
          // Show the full layout with the sidebar for other routes
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
