import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/authContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);
  console.log(user);

  const handleLogout = () => {
    logoutUser();
    navigate("/export-import");
  };

  return (
    <header className="bg-slate-100 border-b shadow-sm w-[99vw] ">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="lg:hidden"
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
              }}
            >
              <Menu className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              style={{
                backgroundColor: "white",
                border: "none",
                outline: "none",
              }}
            >
              <DropdownMenuItem asChild>
                <NavLink
                  to="/export-import/dashboard"
                  className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
                >
                  Accounts
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink
                  to="/export-import/warehouse"
                  className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
                >
                  Warehouse
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink
                  to="/export-import/admin"
                  className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
                >
                  Admin
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink
            to="/export-import"
            className="text-xl font-bold text-primary"
          >
            THT
          </NavLink>
        </div>

        <nav className="hidden lg:flex gap-6 text-sm font-medium">
          <NavLink
            to="/export-import/dashboard"
            className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
          >
            Accounts
          </NavLink>
          <NavLink
            to="/export-import/warehouse"
            className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
          >
            Warehouse
          </NavLink>
          <NavLink
            to="/export-import/admin"
            className="text-black hover:bg-gray-200 hover:text-white px-3 py-2 rounded font-bold"
          >
            Admin
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Button
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
                fontWeight: "bold",
                outline: "none",
              }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          ) : (
            <NavLink to="/export-import/login">
              <Button
                style={{
                  color: "black",
                  border: "none",
                  backgroundColor: "transparent",
                  fontWeight: "bold",
                  outline: "none",
                }}
              >
                Sign In
              </Button>
            </NavLink>
          )}
          <NavLink to="/export-import/signup">
            <Button
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
                fontWeight: "bold",
                outline: "none",
              }}
            >
              Create New User
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
