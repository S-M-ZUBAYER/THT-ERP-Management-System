import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  LogOut,
  UserRoundPen,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import GrozziieLogo from "../../assets/WebsiteImages/GrozziieLogo.svg";
import useAuthStore from "../../store/auth";

export default function Navbar({ setShowEditModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("taskUser");
    localStorage.removeItem("wowomartUser");
    navigate("/");
  };

  // helper function for active styling
  const getNavClass = (path) =>
    ` transition ${
      location.pathname === path
        ? "text-[#004368] text-base font-semibold "
        : "text-[#272727] text-base font-medium hover:text-[#004368]"
    }`;

  return (
    <div className="w-full flex justify-between items-center max-w-9xl mb-4 ">
      <button
        onClick={() => navigate("/")}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <img src={GrozziieLogo} alt="grozziie logo" />
      </button>

      <div className="flex items-center gap-6 ">
        <button
          onClick={() => navigate("/home")}
          className={getNavClass("/home")}
        >
          Home
        </button>
        <button
          onClick={() => navigate("/settings")}
          className={getNavClass("/settings")}
        >
          Settings
        </button>
        <button
          onClick={() =>
            window.open("https://printernoble.com/appshelp/", "_blank")
          }
          className="text-sm font-medium text-[#272727] hover:text-[#004368] transition"
        >
          App & Helps
        </button>
        <button
          onClick={() => navigate("/contact")}
          className={getNavClass("/contact")}
        >
          Contact Us
        </button>
      </div>

      <div className="flex items-center gap-4 relative">
        <button className="p-2 rounded-full border hover:bg-gray-100 border-blue-300 transition">
          <Settings size={18} />
        </button>

        <div
          className="flex items-center gap-2 border p-[3px] rounded-full bg-gray-50 hover:bg-gray-100 transition cursor-pointer select-none"
          onClick={() => setShowDropdown((p) => !p)}
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

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[43px] right-[-25px] bg-white border shadow-lg rounded-md w-40 overflow-hidden z-50"
            >
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-start"
              >
                <UserRoundPen size={16} />{" "}
                <span className="pl-2"> Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center justify-start"
              >
                <LogOut size={16} /> <span className="pl-2">Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
