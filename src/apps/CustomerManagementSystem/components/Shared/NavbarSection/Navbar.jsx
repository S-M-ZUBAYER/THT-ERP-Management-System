import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { RiMenu3Line } from "react-icons/ri";
import GrozzieeLogo from "../../../Assets/Images/Grozziie/Grozziie_logo.jpg";
// import { AllProductContext } from "@/apps/CustomerManagementSystem/context/ProductContext";
import NetworkStatus from "../NetworkStatus";
import { AuthContext } from "@/apps/CustomerManagementSystem/App";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSideNabOpen, setIsSideNabOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { user, serviceCountry } = useContext(AuthContext);
  // const { showData } = useContext(AllProductContext);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSideNabMenu = () => setIsSideNabOpen(!isSideNabOpen);
  const customerToggleMenu = () => setIsCustomerOpen(!isCustomerOpen);
  const adminToggleMenu = () => setIsAdminOpen(!isAdminOpen);

  return (
    <header aria-label="Site Header" className="bg-white  sticky top-0 z-50">
      <div className="mx-auto px-6 md:px-0">
        <div className="flex h-16 items-center justify-evenly">
          <div className="relative visible lg:hidden">
            {user?.isAdmin === "true" && (
              <button
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={adminToggleMenu}
              >
                <RiMenu3Line></RiMenu3Line>
              </button>
            )}

            {isAdminOpen && (
              <div className="origin-top-right absolute z-40 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="col-span-1 shadow-lg rounded-lg">
                  <ul
                    data-aos="fade-up-right"
                    data-aos-duration="2000"
                    className="menu w-full text-start px-3 py-3"
                  >
                    {user?.isAdmin === "true" && (
                      <>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/users"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            All Users
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/questionAnswer"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Q&A, Profile, Support Link
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/warehouse&cities"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Warehouse&Cities
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/modelHightWidth"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Bluetooth Model H&W
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/wifiModelHightWidth"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Wifi Model H&W
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/icon"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Icons
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/backgroundImg"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Background Image & Video
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/mallProduct"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Mall Products
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/eventProduct"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Event Products
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/shopifyInfo"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Add Shopify & Others Info
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/userBaseBitmap"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            User Base Bitmap
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/FaceAttendance"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Face Attendance Management
                          </Link>
                        </li>
                        <li className="mb-5">
                          <Link
                            to="/customer-management-system/admin/powerBank"
                            className="sm:text-xs md:text-base text-gray-700 font-normal"
                          >
                            Power Bank
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <Link
              className="block text-teal-600 dark:text-teal-600"
              to="/customer-management-system/home"
            >
              <span className="sr-only">Home</span>

              <img className="w-32 h-8" src={GrozzieeLogo}></img>
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Site Nav">
              <ul className="flex items-center gap-6 text-base ">
                <li>
                  <Link
                    className="text-gray-500 font-normal transition hover:font-semibold hover:text-zinc-900"
                    to="/customer-management-system/home"
                  >
                    Home
                  </Link>
                </li>
                {serviceCountry !== "CN" && (
                  <li>
                    <div className="relative">
                      <button
                        className="flex justify-between items-center font-normal text-gray-500 transition hover:font-semibold hover:text-zinc-900"
                        onClick={toggleMenu}
                      >
                        Customer Service
                        <MdArrowDropDown className="text-2xl pt-1"></MdArrowDropDown>
                      </button>
                      {isOpen && (
                        <div className="absolute left-0 z-40 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <Link
                              to="/customer-management-system/customer-1"
                              onClick={toggleMenu}
                              className="block px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100  hover:font-semibold hover:text-zinc-900"
                              role="menuitem"
                            >
                              Automatic Service
                            </Link>
                            <Link
                              to="/customer-management-system/customer-2"
                              onClick={toggleMenu}
                              className="block px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 hover:font-semibold hover:text-zinc-900"
                              role="menuitem"
                            >
                              Manual Service
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                )}

                {serviceCountry === "CN" && (
                  <li>
                    <div className="relative">
                      <button
                        className="flex justify-between items-center font-normal  text-gray-500 transition hover:font-semibold hover:text-zinc-900"
                        onClick={toggleMenu}
                      >
                        Chinese Customer Service
                        <MdArrowDropDown className="text-2xl pt-1"></MdArrowDropDown>
                      </button>
                      {isOpen && (
                        <div className="absolute left-0 z-40 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <Link
                              to="/customer-management-system/chineseCustomer"
                              onClick={toggleMenu}
                              className="block px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 hover:font-semibold hover:text-zinc-900"
                              role="menuitem"
                            >
                              Chinese Service
                            </Link>
                            <Link
                              to="/customer-management-system/customer-2"
                              onClick={toggleMenu}
                              className="block px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 hover:font-semibold hover:text-zinc-900"
                              role="menuitem"
                            >
                              Manual Service
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                )}

                {user?.isAdmin === "true" && (
                  <li>
                    <Link
                      className="text-gray-500 font-normal transition hover:font-semibold hover:text-zinc-900"
                      to="/customer-management-system/admin/dashboard"
                    >
                      Admin
                    </Link>
                  </li>
                )}

                <li>
                  <a
                    className="text-gray-500 transition font-normal hover:font-semibold hover:text-zinc-900"
                    href="https://grozziieget.zjweiting.com:8032/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Translator
                  </a>
                </li>

                <li>
                  <Link
                    className="text-gray-500 transition font-normal hover:font-semibold hover:text-zinc-900"
                    to="/customer-management-system/detect"
                  >
                    Detect
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-500 transition font-normal hover:font-semibold hover:text-zinc-900"
                    to="/customer-management-system/account"
                  >
                    Account
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-gray-500 transition font-normal hover:font-semibold hover:text-zinc-900"
                    to="/customer-management-system/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <NetworkStatus></NetworkStatus>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              {user ? (
                ""
              ) : (
                <Link
                  className="rounded-md bg-[#004368] px-5 py-2 text-sm font-semibold text-white shadow dark:hover:bg-teal-500"
                  to="/customer-management-system/login"
                >
                  Sign In
                </Link>
              )}
              <div className="font-semibold text-base flex items-center">
                {/* {showData} */}
              </div>
            </div>

            <div className="relative sm:visible lg:hidden">
              <button
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={toggleSideNabMenu}
                // onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {isSideNabOpen && (
                <div className="z-40 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      to="/customer-management-system/home"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  hover:font-semibold hover:text-zinc-900"
                      role="menuitem"
                    >
                      Home
                    </Link>
                    <div className="relative px-4">
                      <button
                        className="mx-auto flex justify-between items-center  text-gray-500 transition hover:text-gray-500/75  hover:font-semibold hover:text-zinc-900"
                        onClick={customerToggleMenu}
                      >
                        Customer Service
                        <MdArrowDropDown className="text-2xl pt-1"></MdArrowDropDown>
                      </button>
                      {isCustomerOpen && (
                        <div className="absolute left-[-180px] top-3 z-40 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hover:font-semibold hover:text-zinc-900">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <Link
                              to="/customer-management-system/customer-1"
                              onClick={customerToggleMenu}
                              className="block py-2 text-sm text-gray-700 hover:bg-gray-100 ring-black ring-opacity-5  hover:font-semibold hover:text-zinc-900 "
                              role="menuitem"
                            >
                              Automatic Service
                            </Link>
                            <Link
                              to="/customer-management-system/customer-2"
                              onClick={customerToggleMenu}
                              className="block py-2 text-sm text-gray-700 hover:bg-gray-100 hover:font-semibold hover:text-zinc-900"
                              role="menuitem"
                            >
                              Manual Service
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                    {user?.isAdmin === "true" && (
                      <Link
                        to="/customer-management-system/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Admin
                      </Link>
                    )}

                    {/* <Link
                      to="/translator"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Translator
                    </Link> */}
                    <li>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        href="https://grozziieget.zjweiting.com:8032/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Translator
                      </a>
                    </li>

                    <Link
                      to="/customer-management-system/detect"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Detect
                    </Link>
                    <Link
                      to="/customer-management-system/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Account
                    </Link>
                    <Link
                      to="/customer-management-system/contact"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
