import React, { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "../../Shared/NavbarSection/Navbar";
import Footer from "../../Shared/FooterSection/Footer";
import { AuthContext } from "@/apps/CustomerManagementSystem/context/UserContext";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const linkClasses =
    "block p-2 text-sm lg:text-base !font-normal text-gray-700 hover:text-[#004368] transition rounded-md";

  const activeLinkClasses =
    "block p-2 text-sm lg:text-base !font-normal text-[#004368] bg-blue-100  transition";

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-5 lg:gap-3">
        {/* Sidebar */}
        <div className="hidden lg:block col-span-1 shadow-lg rounded-lg bg-white">
          <ul
            data-aos="fade-up-right"
            data-aos-duration="2000"
            className="w-full text-start space-y-2 px-2 py-1"
          >
            {user?.isAdmin === "true" && (
              <>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/users"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    All Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/questionAnswer"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Q&A, Profile, Support Link
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/warehouse&cities"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Warehouse & Cities
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/modelHightWidth"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Bluetooth Model H&W
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/wifiModelHightWidth"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Wifi Model H&W
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/icon"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Icons
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/backgroundImg"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Background Image & Video
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/adminBackgroundImg"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Admin Background Image
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/mallProduct"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Mall Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/eventProduct"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Event Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/shopifyInfo"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Add Shopify & Others Info
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/userBaseBitmap"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    User Base Bitmap
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-management-system/admin/powerBank"
                    className={({ isActive }) =>
                      isActive ? activeLinkClasses : linkClasses
                    }
                  >
                    Power Bank
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-span-5 lg:col-span-4 shadow-lg rounded-lg">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
