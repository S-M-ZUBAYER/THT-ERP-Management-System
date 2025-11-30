import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import { Card, CardContent } from "@/components/ui/card";
import PermissionModal from "../PermissionModal";
import Navbar from "../SharedPage/Navbar";
import WebsiteCard from "./WebsiteCard";
import wowomartLogo from "../../assets/WebsiteImages/wowmartDashboard.jpg";
import customerManagementLogo from "../../assets/WebsiteImages/customerManagement.jpg";
import exportImportLogo from "../../assets/WebsiteImages/exportImportLogo.jpg";
import taskManagementLogo from "../../assets/WebsiteImages/taskManagmentLogo.jpg";
import translatorLogo from "../../assets/WebsiteImages/translatorLogo.jpg";
import attendanceShiftingLogo from "../../assets/WebsiteImages/attendanceShiftingLogo.jpg";
import "../../apps/CustomerManagementSystem/components/Shared/responsive-container.css";

const websites = [
  {
    name: "THT-Customer Management System",
    route: "/customer-management-system",
    img: customerManagementLogo,
  },
  {
    name: "THT-Export-Import System",
    route: "/export-import",
    img: exportImportLogo,
  },
  {
    name: "THT-Task Management System",
    route: "/task-management",
    img: taskManagementLogo,
  },
  {
    name: "THT-Wowomart Management System",
    route: "/wowomart-management",
    img: wowomartLogo,
  },
  { name: "THT-Translator System", route: "/translator", img: translatorLogo },
  {
    name: "THT-Attendance Shifting System",
    route: "/attendance-shifting",
    img: attendanceShiftingLogo,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!user && !savedUser) navigate("/");
    else if (!user && savedUser) useAuthStore.getState().setUser(savedUser);
  }, [user, navigate]);

  const handleRouteNavigate = (site) => {
    if (!site.route) return;
    if (!user) return setShowPermissionModal(true);

    const {
      thtManagement,
      taskManagement,
      wowomartManagement,
      ExportImportManagement,
    } = user;
    const routePermissions = {
      "/customer-management-system": thtManagement,
      "/translator": thtManagement,
      "/attendance-shifting": thtManagement,
      "/task-management": taskManagement,
      "/wowomart-management": wowomartManagement,
      "/export-import": ExportImportManagement,
    };

    const hasPermission = routePermissions[site.route];
    if (!hasPermission) return setShowPermissionModal(true);
    navigate(site.route);
  };

  return (
    <div className="min-h-screen responsive-container bg-white text-gray-800 flex flex-col items-center px-6 py-10">
      <Navbar />

      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 pt-8">
        Welcome to
      </h1>
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-gray-600">
        Grozziie Multi-Site Manager
      </h2>
      <p className="text-gray-500 text-center max-w-3xl mb-10">
        Effortlessly manage and monitor all your websites from a single,
        powerful dashboard. Streamline updates, track performance, and stay in
        control with Grozziie Multi-Site Management System.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-9xl w-full pb-12">
        {websites.map((site, idx) => (
          <WebsiteCard
            key={idx}
            site={site}
            handleRouteNavigate={handleRouteNavigate}
          />
        ))}
      </div>

      <PermissionModal
        show={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />
    </div>
  );
}
