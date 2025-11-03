// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../store/auth";
// import { Card, CardContent } from "@/components/ui/card";
// import wowomartLogo from "../assets/WebsiteImages/wowmartDashboard.jpg";
// import customerManagementLogo from "../assets/WebsiteImages/customerManagement.jpg";
// import exportImportLogo from "../assets/WebsiteImages/exportImportLogo.jpg";
// import taskManagementLogo from "../assets/WebsiteImages/taskManagmentLogo.jpg";
// import translatorLogo from "../assets/WebsiteImages/translatorLogo.jpg";
// import attendanceShiftingLogo from "../assets/WebsiteImages/attendanceShiftingLogo.jpg";
// import PermissionModal from "./PermissionModal";

// const websites = [
//   {
//     name: "THT-Customer Management System",
//     route: "/customer-management-system",
//     img: customerManagementLogo,
//   },
//   {
//     name: "THT-Export-Import System",
//     route: "/export-import",
//     img: exportImportLogo,
//   },
//   {
//     name: "THT-Task Management System",
//     route: "/task-management",
//     img: taskManagementLogo,
//   },
//   {
//     name: "THT-Wowomart Management System",
//     route: "/wowomart-management",
//     img: wowomartLogo,
//   },
//   {
//     name: "THT-Translator System",
//     route: "/translator",
//     img: translatorLogo,
//   },
//   {
//     name: "THT-Attendance Shifting System",
//     route: "/attendance-shifting",
//     img: attendanceShiftingLogo,
//   },
// ];

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const user = useAuthStore((state) => state.user);
//   const [showPermissionModal, setShowPermissionModal] = useState(false);

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user"));
//     if (!user && !savedUser) {
//       navigate("/");
//     } else if (!user && savedUser) {
//       useAuthStore.getState().setUser(savedUser);
//     }
//   }, [user, navigate]);

//   const handleRouteNavigate = (site) => {
//     if (!site.route) return;

//     if (!user) {
//       setShowPermissionModal(true);
//       return;
//     }

//     const {
//       thtManagement,
//       taskManagement,
//       wowomartManagement,
//       ExportImportManagement,
//     } = user;

//     const routePermissions = {
//       "/customer-management-system": thtManagement,
//       "/translator": thtManagement,
//       "/task-management": taskManagement,
//       "/wowomart-management": wowomartManagement,
//       "/export-import": ExportImportManagement,
//     };

//     if (routePermissions.hasOwnProperty(site.route)) {
//       const hasPermission = routePermissions[site.route];
//       if (!hasPermission) {
//         setShowPermissionModal(true);
//         return;
//       }
//     }

//     navigate(site.route);
//   };

//   return (
//     <div className="min-h-screen w-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
//       <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
//         Our Websites
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
//         {websites.map((site, idx) => (
//           <Card
//             key={idx}
//             className="cursor-pointer hover:shadow-2xl transition duration-200"
//             onClick={() => handleRouteNavigate(site)}
//           >
//             <CardContent className="p-4">
//               <img
//                 src={site.img}
//                 alt={site.name}
//                 className="w-full h-40 object-cover rounded-md mb-4"
//               />
//               <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
//                 {site.name}
//               </h2>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       {/* Modal */}
//       <PermissionModal
//         show={showPermissionModal}
//         onClose={() => setShowPermissionModal(false)}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ChevronRight, UserCircle2 } from "lucide-react";
import wowomartLogo from "../assets/WebsiteImages/wowmartDashboard.jpg";
import GrozziieLogo from "../assets/WebsiteImages/GrozziieLogo.svg";
import customerManagementLogo from "../assets/WebsiteImages/customerManagement.jpg";
import exportImportLogo from "../assets/WebsiteImages/exportImportLogo.jpg";
import taskManagementLogo from "../assets/WebsiteImages/taskManagmentLogo.jpg";
import translatorLogo from "../assets/WebsiteImages/translatorLogo.jpg";
import attendanceShiftingLogo from "../assets/WebsiteImages/attendanceShiftingLogo.jpg";
import PermissionModal from "./PermissionModal";

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
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({});

  // Sync formData whenever user changes
  useEffect(() => {
    setFormData(user);
  }, [user]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!user && !savedUser) {
      navigate("/");
    } else if (!user && savedUser) {
      useAuthStore.getState().setUser(savedUser);
    }
  }, [user, navigate]);

  // ✅ handle go to website page
  const handleRouteNavigate = (site) => {
    if (!site.route) return;

    if (!user) {
      setShowPermissionModal(true);
      return;
    }

    const {
      thtManagement,
      taskManagement,
      wowomartManagement,
      ExportImportManagement,
    } = user;

    const routePermissions = {
      "/customer-management-system": thtManagement,
      "/translator": thtManagement,
      "/task-management": taskManagement,
      "/wowomart-management": wowomartManagement,
      "/export-import": ExportImportManagement,
    };
    console.log(user, "user");

    if (routePermissions.hasOwnProperty(site.route)) {
      const hasPermission = routePermissions[site.route];
      if (!hasPermission) {
        setShowPermissionModal(true);
        return;
      }
    }

    navigate(site.route);
  };

  // ✅ handle update user
  const handleUpdateUser = async () => {
    if (!formData?.id) {
      console.error("User ID missing");
      return;
    }

    try {
      // Optionally show a loader here
      const response = await fetch(
        `https://grozziieget.zjweiting.com:8033/tht/users/update/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            designation: formData.designation,
            language: formData.language,
            country: formData.country,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const data = await response.json();
      console.log("✅ User updated successfully:", data);

      // Update localStorage and Zustand store
      localStorage.setItem("user", JSON.stringify(formData));
      useAuthStore.getState().setUser(formData);

      // Close modal
      setShowEditModal(false);
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  // ✅ handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("taskUser");
    localStorage.removeItem("wowomartUser");
    navigate("/");
  };

  // ✅ handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center px-6 py-10">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center max-w-9xl mb-4">
        <button className="p-2 rounded-full  hover:bg-gray-100 transition">
          <img src={GrozziieLogo} alt="grozziie logo" />
        </button>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full border hover:bg-gray-100 border-blue-300 transition">
            <Settings size={18} />
          </button>
          <div
            className="flex items-center gap-2 border p-[3px] rounded-full bg-gray-50 hover:bg-gray-100 transition cursor-pointer select-none"
            onClick={() => setShowDropdown((prev) => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="User"
                className="w-8 h-8 rounded-full object-cover border border-blue-300"
              />
            ) : (
              <UserCircle2 size={18} className="text-gray-600" />
            )}
            <span className="text-sm font-medium">
              {user?.name || "User Name"}
            </span>
            <motion.div
              animate={{ rotate: isHovered || showDropdown ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={15} />
            </motion.div>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[90px]  dropdown-position bg-white border shadow-lg rounded-md w-40 overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  🚪 Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Edit Profile Modal */}
          <Dialog
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl">
              <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Edit Profile
              </Dialog.Title>

              <div className="flex flex-col items-center mb-4">
                <img
                  src={formData.image}
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover border border-blue-300 mb-2"
                />
                <p className="text-sm text-gray-500">
                  Profile Picture (read-only)
                </p>
              </div>

              <form className="space-y-3">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    value={formData.email || ""}
                    readOnly
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <input
                    name="language"
                    value={formData.language || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    name="designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Admin + permissions */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 pt-3">
                  <p>
                    <strong>isAdmin:</strong> {String(formData.isAdmin)}
                  </p>
                  <p>
                    <strong>thtManagement:</strong>{" "}
                    {formData.thtManagement === 1 ? "true" : "false"}
                  </p>
                  <p>
                    <strong>taskManagement:</strong>{" "}
                    {formData.taskManagement === 1 ? "true" : "false"}
                  </p>
                  <p>
                    <strong>wowomartManagement:</strong>{" "}
                    {formData.wowomartManagement === 1 ? "true" : "false"}
                  </p>
                  <p>
                    <strong>ExportImportManagement:</strong>{" "}
                    {formData.ExportImportManagement === 1 ? "true" : "false"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateUser}
                    className="px-4 py-2 text-sm bg-[#004368] text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Dialog>
        </div>
      </div>

      {/* Header Section */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Welcome to
      </h1>
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-gray-800">
        Grozziie Multi-Site Manager
      </h2>
      <p className="text-gray-500 text-center max-w-3xl mb-10">
        Effortlessly manage and monitor all your websites from a single,
        powerful dashboard. Streamline updates, track performance, and stay in
        control with Grozziie Multi-Site Management System.
      </p>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-9xl w-full">
        {websites.map((site, idx) => (
          <Card
            key={idx}
            className="shadow-md rounded-2xl bg-[#FAFAFA] hover:shadow-xl transition-all duration-200 border border-gray-200"
          >
            <CardContent className="p-5">
              <div
                onClick={() => handleRouteNavigate(site)}
                className="cursor-pointer"
              >
                <img
                  src={site.img}
                  alt={site.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  {site.name}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sm flex items-center gap-1"
                  onClick={() => handleRouteNavigate(site)}
                >
                  Visit site <ChevronRight size={15} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Modal */}
      <PermissionModal
        show={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />
    </div>
  );
}
