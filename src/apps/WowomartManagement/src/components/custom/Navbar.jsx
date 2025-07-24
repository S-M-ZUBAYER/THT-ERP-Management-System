import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { BellRing, Menu, X } from "lucide-react";
import image from "../../constants/image";
// import image from "@/constants/image";

const navData = [
  { label: "Log In", path: "/log-in" },
  { label: "Sign up", path: "/sign-up" },
];

export default function Navbar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white  px-2 md:px-[3vw] py-6 flex items-center justify-between relative">
      <NavLink to="/" className="flex items-center gap-2">
        <img src={image.log} alt="logo" className="h-10" />
      </NavLink>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-zinc-700"
        style={{ background: "none", border: "none", outline: "none" }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="hidden md:flex gap-6 items-center">
        <BellRing />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2 p-3 text-sm">
            {navData.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  color: isActive ? "#004368" : "#90B4C8",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {user?.name && (
          <p className="text-xl font-bold text-[#004368]">{user.name}</p>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 md:hidden z-50">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BellRing />
              <span>Notifications</span>
            </div>

            {navData.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className="text-sm font-medium"
                style={({ isActive }) => ({
                  color: isActive ? "#004368" : "#90B4C8",
                })}
                onClick={() => setIsOpen(false)} // close on click
              >
                {item.label}
              </NavLink>
            ))}

            {user?.name && (
              <p className="text-lg font-bold text-[#004368]">{user.name}</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
