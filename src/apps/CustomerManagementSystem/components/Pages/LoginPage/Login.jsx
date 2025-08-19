import React, { useContext } from "react";
import { useState } from "react";
import { GrFacebook, GrGoogle } from "react-icons/gr";
import { BsEyeFill, BsWechat } from "react-icons/bs";
import { RiEyeCloseLine } from "react-icons/ri";
// import { BsEyeFill } from "react-icons/bs";
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import googleLogo from "../../../Assets/Images/Icons/gmailLogo.jpg";
import facebookLogo from "../../../Assets/Images/Icons/facebookLogo.png";
import wechatLogo from "../../../Assets/Images/Icons/wechatLogo.png";
import { toast } from "react-hot-toast";
import BtnSpinner from "../../Shared/Loading/BtnSpinner";
import axios from "axios";
import { AuthContext } from "@/apps/CustomerManagementSystem/App";
import { AllProductContext } from "@/apps/CustomerManagementSystem/context/ProductContext";

const Login = () => {
  const { user, setUser, DUser, setDUser, setChattingUser } =
    useContext(AuthContext);
  const [email, setEmail] = useState(DUser?.email);
  const [password, setPassword] = useState(DUser?.password);
  const location = useLocation();
  const navigate = useNavigate();
  const { setLanguage } = useContext(AllProductContext);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedShops, setSelectedShops] = useState(
    DUser?.selectedShops || []
  );

  const shopNames = [
    "维尔新/WeiErXin PinDuoDuo FlagShop",
    "加普威旗舰店/JiaPuWei Tmall FlagShop",
    "拼多多格志旗舰店/GROZZIIE PinDuoDuo FlagShop",
    "grozziie格志旗舰店/GROZZIIE TMall FlagShop",
    "京东格志旗舰店/GROZZIIE JDPOP FlagShop",
    "京东格志自营旗舰店/GROZZIIE JD FlagShop",
    "维庭数码专营店/WEITING  Digital PinDuoDuo Shop",
  ];

  // const handleSelectChange = (event) => {
  //   const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
  //   setSelectedOptions(selectedValues);
  // };
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedShops((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedShops((prevSelected) =>
        prevSelected.filter((shop) => shop !== value)
      );
    }
  };

  const {
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    loading,
    setLoading,
    serviceCountry,
    setServiceCountry,
  } = useContext(AuthContext);

  const from = location?.state?.from?.pathname || "/";

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      toast.error("please input all the information properly");
      return;
    }
    setLoading(true);
    const form = event.target;
    // handle form submission logic here
    fetch("https://grozziieget.zjweiting.com:8033/tht/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data?.message === "Wrong email/password combination!") {
          toast.error(data.message);
          setLoading(false);
        } else if (data?.message === "User doesn't exist") {
          toast.error(data.message);
          setLoading(false);
        } else {
          setUser(data[0]);
          localStorage.setItem("user", JSON.stringify(data[0]));
          localStorage.setItem(
            "DUser",
            JSON.stringify({ email, password, selectedShops })
          );
          setDUser({ email, password, selectedShops });

          try {
            const url =
              serviceCountry === "CN"
                ? "https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/user/signIn"
                : "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/signIn";

            const response = await axios.post(url, {
              userEmail: email,
              userPassword: password,
              deviceType: "web",
            });

            if (response.status === 200) {
              localStorage.setItem(
                "chattingUser",
                JSON.stringify({
                  userName: response?.data?.userName,
                  userId: response?.data?.userId,
                  userEmail: response?.data?.userEmail,
                  role: "customer_service",
                  designation: response?.data?.designation,
                  country: response?.data?.country,
                })
              );

              setChattingUser({
                userName: response?.data?.userName,
                userId: response?.data?.userId,
                userEmail: response?.data?.userEmail,
                role: "customer_service",
                designation: response?.data?.designation,
                country: response?.data?.country,
              });
              localStorage.setItem(
                "serviceCountry",
                JSON.stringify(serviceCountry)
              );
              setLoading(false);
              form.reset();
              navigate("/");
            } else {
              toast.error(response.data.message);
              setLoading(false);
            }
          } catch (error) {
            console.error("Chatting Registration Error", error);
            toast.error("Chatting Registration failed");
            setLoading(false);
          }

          setLoading(false);
          navigate(from, { replace: true });
          form.reset();
          toast.success("User Login Successfully");
        }
      })

      // signIn(email,password)
      // .then(result=>{
      //     const user=result.user;
      //     setLoading(false);
      //     navigate(from,{replace:true})
      //     form.reset();

      // })
      .catch((err) => {
        // toast.error("Invalid User Name Or Password")
        console.log(err);
        setLoading(false);
      });
  };

  const handleToShow = (event) => {
    event.preventDefault();
    setShow(!show);
    // handle form submission logic here
  };

  const handleToGoogleLogIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        if (user) {
          toast.success(
            "Welcome to THT-Space Electrical Company Ltd Customer service site"
          );
        }
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleToFaceBookLogIn = () => {
    signInWithFacebook()
      .then((result) => {
        const user = result.user;
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleToResetPassword = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match");
      return;
    }

    // Call the API endpoint to reset password with the email
    fetch("https://grozziieget.zjweiting.com:8033/tht/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const handleToResetPassword = () => {
  //     resetPassword(email)
  //         .then(() => {
  //             toast.success('Please check your email to reset')
  //             // setLoading(false);
  //         })
  //         .catch(err => {
  //             toast.error(err.message);
  //             console.log(err);
  //             // setLoading(false);
  //         })
  // }

  return (
    <div className="bg-white flex justify-center items-center">
      <div className="shadow-lg  my-12 py-10 px-12">
        <h2 className="text-2xl text-[#004368] mb-8 font-semibold my-4">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="">
            {/* <label htmlFor="password">Password:</label> */}
            <div className="">
              <div className="text-2xl">
                <button onClick={handleToGoogleLogIn} className="mr-8">
                  <img className="h-9 w-9" src={googleLogo} alt="google"></img>
                </button>
                <button onClick={handleToFaceBookLogIn} className="mr-8">
                  <img
                    className="h-9 w-9"
                    src={facebookLogo}
                    alt="facebook"
                  ></img>
                </button>
                <button>
                  <img className="h-9 w-9" src={wechatLogo} alt="wechat"></img>
                </button>
              </div>

              <div className="my-3">or</div>

              <div className="flex justify-start mb-10 pl-2">
                <label className=" font-semibold">Location:</label>
                <select
                  value={serviceCountry}
                  onChange={(e) => setServiceCountry(e.target.value)}
                >
                  <option value="EN">English</option>
                  <option value="CN">Chinese</option>
                </select>
              </div>

              {/* <label htmlFor="email">Email:</label> */}
              <input
                className=" w-full pl-2 text-gray-800 bg-white"
                placeholder="username or email"
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
              <hr className="  mb-10"></hr>
              <div className="relative">
                <div className="flex items-center">
                  <input
                    className=" w-full pl-2 text-gray-800 bg-white"
                    placeholder="password"
                    type={show ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    className="absolute right-0 pr-2"
                    onClick={handleToShow}
                  >
                    {show ? (
                      <BsEyeFill className="text-slate-500"></BsEyeFill>
                    ) : (
                      <RiEyeCloseLine className="text-slate-500"></RiEyeCloseLine>
                    )}
                  </button>
                </div>

                <hr className=" "></hr>
                {/* <button>digit to start</button>
                        <button>start to digit</button> */}
              </div>
              <div className="text-end text-sm mb-8">
                <button
                  type="button"
                  className="text-[#65ABFF] font-semibold"
                  onClick={openModal}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div
              className="text-start mb-8"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
                border: "1px solid #ccc",
              }}
            >
              {shopNames?.map((shop, index) => (
                <div className="px-3 " key={index}>
                  <input
                    className="mr-2"
                    type="checkbox"
                    value={shop}
                    checked={selectedShops.includes(shop)}
                    onChange={handleCheckboxChange}
                  />
                  {shop}
                </div>
              ))}
            </div>
          </div>

          <div className="my-2 ">
            <button
              className="bg-[#004368]  text-white rounded-md px-32 py-1 text-xl font-semibold "
              type="submit"
            >
              {loading ? <BtnSpinner></BtnSpinner> : "Sign In"}
            </button>
          </div>
        </form>
        <div className="text-sm my-3">
          Don't have an account?{" "}
          <Link className="font-semibold text-[#65ABFF]" to="/register">
            Create an account
          </Link>
        </div>

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>

              <h2>Reset Password</h2>

              <form>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label>Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="button" onClick={handleToResetPassword}>
                  Save
                </button>
              </form>

              {errorMessage && <p>{errorMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
