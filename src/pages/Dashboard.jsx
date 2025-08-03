import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Card, CardContent } from "@/components/ui/card";
import wowomartLogo from "../assets/WebsiteImages/wowmartDashboard.jpg";
import customerManagementLogo from "../assets/WebsiteImages/customerManagement.jpg";
import exportImportLogo from "../assets/WebsiteImages/exportImportLogo.jpg";
import taskManagementLogo from "../assets/WebsiteImages/taskManagmentLogo.jpg";
import translatorLogo from "../assets/WebsiteImages/translatorLogo.jpg";
import attendanceShiftingLogo from "../assets/WebsiteImages/attendanceShiftingLogo.jpg";

const websites = [
  {
    name: "THT-Customer Management System",
    route: "/customer-management",
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
  {
    name: "THT-Translator System",
    route: "/translator",
    img: translatorLogo,
  },
  {
    name: "THT-Attendance Shifting System",
    route: "/attendance-shifting",
    img: attendanceShiftingLogo,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!user && !savedUser) {
      navigate("/");
    } else if (!user && savedUser) {
      useAuthStore.getState().setUser(savedUser);
    }
  }, [user, navigate]);

  const handleRouteNavigate = (site) => {
    if (!site.route) return;
    navigate(site.route);
  };

  return (
    <div className="min-h-screen w-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Our Websites
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {websites.map((site, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:shadow-2xl transition duration-200"
            onClick={() => handleRouteNavigate(site)}
          >
            <CardContent className="p-4">
              <img
                src={site.img}
                alt={site.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                {site.name}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
