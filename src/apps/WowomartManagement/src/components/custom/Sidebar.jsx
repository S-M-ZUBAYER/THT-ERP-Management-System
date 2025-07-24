import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  User,
  UserX,
  HelpCircle,
  MessageCircle,
  LogOut,
  TicketPercent,
  SquareChartGantt,
  BookUser,
  Tag,
  DiamondPercent,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Pending account",
    icon: User,
    path: "/wowomart-management/pending",
  },
  {
    label: "Created account",
    icon: Users,
    path: "/wowomart-management/created",
  },
  {
    label: "Disable account",
    icon: UserX,
    path: "/wowomart-management/disabled",
  },
  {
    label: "Coupon",
    icon: TicketPercent,
    path: "/wowomart-management/discount",
  },
  { label: "Assign-tag", icon: Tag, path: "/wowomart-management/assign-tag" },
  {
    label: "Add-Percent",
    icon: DiamondPercent,
    path: "/wowomart-management/add-percent",
  },
  {
    label: "Coupon Details",
    icon: SquareChartGantt,
    path: "/wowomart-management/discount-table",
  },
  {
    label: "Coupon user List",
    icon: BookUser,
    path: "/wowomart-management/coupon-user-list",
  },
];

const supportItems = [
  { label: "Help Centre", icon: HelpCircle, path: "/wowomart-management/help" },
  {
    label: "Contact us",
    icon: MessageCircle,
    path: "/wowomart-management/contact",
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="xl:hidden p-4 flex justify-between items-center border-b border-zinc-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Sidebar"
          style={{ background: "none", border: "none", outline: "none" }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={cn(
          "fixed xl:static z-50 xl:z-auto h-screen w-64 bg-white py-6 border-r border-zinc-200 flex flex-col justify-between transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        )}
      >
        <div className="space-y-2">
          {menuItems.map(({ label, icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2 text-sm font-medium hover:text-[#004368] transition-all",
                  isActive && "border-r-4"
                )
              }
              style={({ isActive }) => ({
                color: isActive ? "#004368" : "#90B4C8",
                borderColor: isActive ? "#004368" : "transparent",
              })}
              onClick={() => setIsOpen(false)}
            >
              {React.createElement(icon, { size: 18 })}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-2 pb-24">
          {supportItems.map(({ label, icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:text-[#004368] transition-all"
              style={{ color: "#90B4C8" }}
              onClick={() => setIsOpen(false)}
            >
              {React.createElement(icon, { size: 18 })}
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:text-red-600 transition-all bg-zinc-900"
            onClick={() => {
              console.log("Logging out...");
              localStorage.clear();
              navigate("/log-in", { replace: true });
              window.location.reload();
            }}
            style={{ backgroundColor: "white", outline: "none" }}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
