import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);
  console.log(user);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-tr bg-slate-200">
      <div className="container mx-auto navbar bg-gradient-to-tr bg-slate-200 px-14 text-black font-semibold">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-slate-200 rounded-box w-52 font-bold "
            >
              <li>
                <NavLink to="/export-import/dashboard">Accounts</NavLink>
              </li>
              <li>
                <NavLink to="/export-import/warehouse">Warehouse</NavLink>
              </li>
              <li>
                <NavLink to="/export-import/admin">Admin</NavLink>
              </li>
            </ul>
          </div>
          <NavLink
            to="/export-import"
            className="btn btn-ghost normal-case text-xl"
          >
            THT
          </NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink
                className="hover:font-bold hover:text-white"
                to="/export-import/dashboard"
              >
                Accounts
              </NavLink>
            </li>
            <li>
              <NavLink
                className="hover:font-bold hover:text-white mx-2"
                to="/export-import/warehouse"
              >
                Warehouse
              </NavLink>
            </li>
            <li>
              <NavLink
                className="hover:font-bold hover:text-white"
                to="/export-import/admin"
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-4">
          <div>
            {user ? (
              <p
                className="hover:text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                Log Out
              </p>
            ) : (
              <NavLink to="/export-import/login" className="">
                Sign In
              </NavLink>
            )}
          </div>

          <div>
            <Link className="hover:text-green-600" to="/export-import/signup">
              Create New User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
