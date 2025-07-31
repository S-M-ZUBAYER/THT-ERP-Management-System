import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../components/context/authContext";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { loginUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!userName.trim()) {
      validationErrors.userName = "Name is required";
    }
    if (!role.trim()) {
      validationErrors.userName = "Role is required";
    }

    if (!userEmail.trim()) {
      validationErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      validationErrors.userEmail = "Invalid email format";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(validationErrors).length === 0) {
      setBtnLoading(true);
      axios
        .post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users/signup",
          { userName, userEmail, password, role }
        )
        .then(() => {
          loginUser(userEmail);
          toast.success("User create Successfully", { position: "top-center" });
          navigate("/export-import");
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong", { position: "top-center" });
        })
        .finally(() => {
          setBtnLoading(false);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2 bg-white">
        <div
          className="py-16 px-20"
          style={{
            borderRadius: "50px",
            background: "#e0e0e0",
            boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
          }}
        >
          <h1 className="text-4xl font-semibold">Welcome To Registration </h1>
          <p className="font-medium text-base text-gray-500 mt-4 text-center">
            Please Enter Your Details
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mt-5">
              <div>
                <label className="text-lg font-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent autofill-black"
                  placeholder="Enter your name"
                  type="text"
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                {errors.userName && (
                  <p className="text-red-600 font-semibold my-1">
                    {errors.userName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-lg font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent autofill-black"
                  placeholder="Enter your email"
                  type="text"
                  name="useEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                {errors.userEmail && (
                  <p className="text-red-600 font-semibold my-1">
                    {errors.userEmail}
                  </p>
                )}
              </div>
              <div>
                <label className="text-lg font-semibold" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent autofill-black"
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-600 font-semibold my-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="text-lg font-semibold" htmlFor="role">
                  Role
                </label>
                <select
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent autofill-black"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Commercial Manager">Commercial Manager</option>
                  <option value="Finance">Finance</option>
                </select>
                {errors.role && (
                  <p className="text-red-600 font-semibold my-1">
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-y-2">
                <button
                  className="active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
                  type="submit"
                  disabled={btnLoading}
                >
                  {btnLoading ? "Loading" : "Sign up"}
                </button>
                <div className="divider text-base font-semibold text-center ">
                  OR
                </div>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <p className="font-normal text-base">
                  Already have an account?
                </p>
                <button
                  className="text-violet-500 text-base font-medium ml-2"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    outline: "none",
                  }}
                >
                  <Link to="/export-import/login">Log In</Link>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg " />
      </div>
    </div>
  );
};

export default Signup;
