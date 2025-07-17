// import Signin from "@/components/SignIn";
// import icons from "@/constants/icons";
import React from "react";
import icons from "../constants/icons";
import Signin from "../components/SignIn";

function SignInPage() {
  return (
    <>
      <div className="w-[100vw] flex justify-center items-center">
        <div className="flex justify-center items-center shadow-md rounded-lg px-10 py-20 border border-[#E6ECF0] bg-white">
          <img src={icons.Login} alt="login" />
          <Signin />
        </div>
      </div>
    </>
  );
}

export default SignInPage;
