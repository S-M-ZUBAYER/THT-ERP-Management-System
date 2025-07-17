import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className=" flex justify-center">
      {/* <Navbar></Navbar> */}
      <Outlet></Outlet>
      {/* <Footer></Footer> */}
    </div>
  );
};

export default Main;
