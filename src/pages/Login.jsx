import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "../store/auth";
import toast from "react-hot-toast";
import logInLogo from "../assets/Login.svg";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand user store
  const setUser = useAuthStore((state) => state.setUser);

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serviceCountry, setServiceCountry] = useState("EN");
  const [selectedShops, setSelectedShops] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location?.state?.from?.pathname || "/dashboard";

  const shopNames = [
    "维尔新/WeiErXin PinDuoDuo FlagShop",
    "加普威旗舰店/JiaPuWei Tmall FlagShop",
    "拼多多格志旗舰店/GROZZIIE PinDuoDuo FlagShop",
    "grozziie格志旗舰店/GROZZIIE TMall FlagShop",
    "京东格志旗舰店/GROZZIIE JDPOP FlagShop",
    "京东格志自营旗舰店/GROZZIIE JD FlagShop",
    "维庭数码专营店/WEITING Digital PinDuoDuo Shop",
  ];

  // Load stored user credentials
  useEffect(() => {
    const storedDUser = JSON.parse(localStorage.getItem("DUser"));
    if (storedDUser) {
      setEmail(storedDUser.email || "");
      setPassword(storedDUser.password || "");
      setSelectedShops(storedDUser.selectedShops || []);
    }
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedShops((prev) =>
      checked ? [...prev, value] : prev.filter((shop) => shop !== value)
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!email || !password) {
  //     toast.error("Please input all the information properly");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await fetch(
  //       "https://grozziieget.zjweiting.com:8033/tht/login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok || !data || !data[0]) {
  //       toast.error("Invalid User");
  //       setLoading(false);
  //       return;
  //     }

  //     const userInfo = data[0];
  //     const userWithPlainPassword = { ...userInfo, password };
  //     useAuthStore.getState().setUser(userWithPlainPassword);
  //     localStorage.setItem("user", JSON.stringify(userWithPlainPassword));
  //     localStorage.setItem(
  //       "DUser",
  //       JSON.stringify({ email, password, selectedShops })
  //     );

  //     // Chatting API call
  //     const chatUrl =
  //       serviceCountry === "CN"
  //         ? "https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/user/signIn"
  //         : "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/signIn";

  //     try {
  //       const chatRes = await axios.post(chatUrl, {
  //         userEmail: email,
  //         userPassword: password,
  //         deviceType: "web",
  //       });

  //       if (chatRes.status === 200) {
  //         localStorage.setItem(
  //           "chattingUser",
  //           JSON.stringify({
  //             userName: chatRes.data.userName,
  //             userId: chatRes.data.userId,
  //             userEmail: chatRes.data.userEmail,
  //             role: "customer_service",
  //             designation: chatRes.data.designation,
  //             country: chatRes.data.country,
  //           })
  //         );
  //         localStorage.setItem("serviceCountry", serviceCountry);
  //       } else {
  //         toast.error(chatRes.data.message);
  //       }
  //     } catch (err) {
  //       console.error("Chat registration error:", err);
  //     }

  //     toast.success("Login successful");
  //     navigate(from, { replace: true });
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     toast.error("Invalid User");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please input all the information properly");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Main THT login
      const res = await fetch(
        "https://grozziieget.zjweiting.com:8033/tht/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data || !data[0]) {
        toast.error("Invalid User");
        setLoading(false);
        return;
      }

      const userInfo = data[0];

      // 2️⃣ Save user & DUser locally
      useAuthStore.getState().setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      if (userInfo?.thtManagement) {
        localStorage.setItem(
          "DUser",
          JSON.stringify({ email, password, selectedShops })
        );
      }

      // 3️⃣ Chat registration API call
      const chatUrl =
        serviceCountry === "CN"
          ? "https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/user/signIn"
          : "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/signIn";

      try {
        const chatRes = await axios.post(chatUrl, {
          userEmail: email,
          userPassword: password,
          deviceType: "web",
        });

        if (chatRes.status === 200) {
          localStorage.setItem(
            "chattingUser",
            JSON.stringify({
              userName: chatRes.data.userName,
              userId: chatRes.data.userId,
              userEmail: chatRes.data.userEmail,
              role: "customer_service",
              designation: chatRes.data.designation,
              country: chatRes.data.country,
            })
          );
          localStorage.setItem("serviceCountry", serviceCountry);
        } else {
          toast.error(chatRes.data.message);
        }
      } catch (err) {
        console.error("Chat registration error:", err);
      }

      // 4️⃣ Check ExportImportManagement condition
      if (userInfo.ExportImportManagement === 1) {
        try {
          // Sign in to ExportImport system
          const exportRes = await axios.post(
            "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users/signin",
            {
              userEmail: email,
              password: password,
            }
          );

          if (exportRes.data === true) {
            // Fetch user data from export system
            const exportUserRes = await axios.get(
              "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users"
            );

            const matchedExportUser = exportUserRes.data.find(
              (u) => u.userEmail === email
            );

            if (matchedExportUser) {
              // Update the stored user with export management details
              const { userName, userEmail, role, admin } =
                matchedExportUser || {};

              const mergedUser = {
                ...userInfo,
                userName,
                userEmail,
                role,
                admin,
              };
              localStorage.setItem("user", JSON.stringify(mergedUser));
              useAuthStore.getState().setUser(mergedUser);
              toast.success("Export Management Login Successful");
            } else {
              toast.error("Export management user not found");
            }
          } else {
            toast.error("Export management login failed");
          }
        } catch (error) {
          console.error("ExportImportManagement login error:", error);
        }
      }

      // 5️⃣ Task Management Process
      if (userInfo.taskManagement === 1) {
        try {
          const taskRes = await fetch(
            "https://grozziie.zjweiting.com:57683/tht/taskManagement/api/user/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const taskData = await taskRes.json();

          if (taskRes.ok && !taskData.error) {
            localStorage.setItem("taskUser", JSON.stringify(taskData.result));
            toast.success("Task Management Login Successful");
          } else {
            toast.error("Task Management login failed");
          }
        } catch (err) {
          console.error("Task Management login error:", err);
          toast.error("Task Management login error");
        }
      }
      // 6️⃣ Wowomart Management
      if (userInfo.wowomartManagement === 1) {
        try {
          const wowomartRes = await fetch(
            "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const wowomartData = await wowomartRes.json();

          if (wowomartRes.ok && !wowomartData.error) {
            localStorage.setItem(
              "wowomartUser",
              JSON.stringify(wowomartData.user)
            );
            toast.success("Wowomart Management Login Successful");
          } else {
            toast.error("Wowomart Management login failed");
          }
        } catch (err) {
          console.error("Wowomart Management login error:", err);
          toast.error("Wowomart Management login error");
        }
      }

      // ✅ Final navigation
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid User");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] flex justify-center items-center">
      <div className="flex justify-center items-center shadow-md max-h-[700px] rounded-lg px-10 py-20 border border-[#E6ECF0] bg-white">
        <img src={logInLogo} alt="login" />

        <div className="flex justify-center items-center min-h-screen text-[#004368]">
          <div className="space-x-5 p-10 rounded-2xl lg:w-[30vw] w-[90vw]">
            {/* Heading */}
            <div className="font-[400] text-[24px]">
              <p>Let's get started</p>
              <p>
                <strong>log in</strong> to your account
              </p>
            </div>

            {/* Form */}
            <div className="pt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-black autofill-black"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-black pr-10 autofill-black"
                    />
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </div>

                {/* Location Selector */}
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <select
                    value={serviceCountry}
                    onChange={(e) => setServiceCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
                  >
                    <option value="EN">English</option>
                    <option value="CN">Chinese</option>
                  </select>
                </div>

                {/* Shop Selection */}
                <div className="text-start mb-4 max-h-[180px] overflow-y-scroll border border-gray-200 rounded-md p-3">
                  {shopNames.map((shop, index) => (
                    <div
                      className="flex items-center space-x-2 py-1"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        value={shop}
                        checked={selectedShops.includes(shop)}
                        onChange={handleCheckboxChange}
                      />
                      <label className="text-sm">{shop}</label>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#004368", width: "100%" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Please wait...
                    </>
                  ) : (
                    "Log-In"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
