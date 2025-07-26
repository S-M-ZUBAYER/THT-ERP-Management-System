import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import {
  AiOutlineDashboard,
  AiOutlineExport,
  AiOutlineImport,
} from "react-icons/ai"; // Importing icons
import {
  MdAddToPhotos,
  MdAccountBalance,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { FaShippingFast, FaBoxOpen } from "react-icons/fa";
import {
  BiWorld,
  BiSolidPurchaseTag,
  BiSolidPurchaseTagAlt,
} from "react-icons/bi";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FaCalculator } from "react-icons/fa6";
import { FiPrinter } from "react-icons/fi";
import { FcPrint } from "react-icons/fc";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbBrandElectronicArts } from "react-icons/tb";

const DashboardSidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  console.log(user?.role); // Should now print "Commercial Manager"

  const navLinks = [
    {
      path: "/export-import/dashboard",
      display: "Dashboard",
      icon: <AiOutlineDashboard />, // Dashboard icon
    },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/newproduct",
        display: "Add New Product",
        icon: <MdOutlineProductionQuantityLimits />, // Export icon
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/newbrand",
        display: "Add New Brand",
        icon: <TbBrandElectronicArts />, // Import icon
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/transportroutes",
        display: "Transport Way",
        icon: <FaShippingFast />,
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/transportcountry",
        display: "Destination Country",
        icon: <BiWorld />,
      },

    // {
    //   path: "/export",
    //   display: "Export",
    //   icon: <AiOutlineExport />, // Export icon
    // },
    // {
    //   path: "/import",
    //   display: "Import",
    //   icon: <AiOutlineImport />, // Import icon
    // },
    // Adding new links here
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/datainput",
        display: "Product Data Entry",
        icon: <MdAddToPhotos />,
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/accounts",
        display: "Product Export Summary",
        icon: <MdAccountBalance />,
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/productinboxes",
        display: "Product Palletizing",
        icon: <FaBoxOpen />,
      },
    user &&
      user?.role === "Product Manager" && {
        path: "/export-import/printInitialData",
        display: "Pallet info Printing",
        icon: <FiPrinter />,
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/AddCAndFLevel",
        display: "Add C&F Level",
        icon: <MdOutlineProductionQuantityLimits />, // Export icon
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/addcharges",
        display: "Add Charges",
        icon: <FaMoneyBill1Wave />,
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/addProductInBoxValue",
        display: "Add Product InBox Value",
        icon: <FaCalculator />,
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/export",
        display: "Export Initial Data Entry",
        icon: <BiSolidPurchaseTag />,
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/exportAndFinance",
        display: "Export Finance Data Entry",
        icon: <BiSolidPurchaseTag />,
      },
    user &&
      user?.role === "Commercial Manager" && {
        path: "/export-import/finalExport",
        display: "Final Export Checking",
        icon: <BiSolidPurchaseTagAlt />,
      },
    user &&
      user?.role === "Finance" && {
        path: "/export-import/finance",
        display: "Finance Checking",
        icon: <GiTakeMyMoney />,
      },
    {
      path: "/export-import/finaldata",
      display: "Final Data Display",
      icon: <FcPrint />,
    },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-80" : "w-16"
        } duration-300 h-full bg-cyan-500 text-white relative`}
      >
        {/* Toggle Sidebar Button */}
        <button
          className={`absolute cursor-pointer rounded-full bg-cyan-500 p-2 text-white -right-3 top-9 transform transition-transform ${
            !open ? "rotate-180" : ""
          }`}
          onClick={() => setOpen(!open)}
        >
          {/* {open === false ? <TfiAngleRight /> : <TfiAngleLeft />} */}
          {open ? <TfiAngleLeft /> : <TfiAngleRight />}
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 mt-5 h-screen">
          {navLinks.map(
            (item, index) =>
              item && (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-x-4 pl-4 py-2 text-lg font-semibold rounded-md transition-all ${
                      isActive ? "bg-cyan-800" : "hover:bg-blue-300"
                    }`
                  }
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={`${!open && "hidden"} origin-left duration-300`}
                  >
                    {item.display}
                  </span>
                </NavLink>
              )
          )}
        </div>
      </div>

      {/* Main Content */}
      {/* <div className=" w-3/5 p-5">{children}</div> */}
    </div>
  );
};

export default DashboardSidebar;
