// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import useAuthStore from "../store/auth";
// import toast from "react-hot-toast";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const setUser = useAuthStore((state) => state.setUser);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(
//         "https://grozziieget.zjweiting.com:8033/tht/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok || !data || !data[0]) {
//         toast.error("Invalid User");
//         return; // Stay on login page
//       }

//       const userInfo = data[0];
//       const userWithPlainPassword = { ...userInfo, password }; // correct!
//       console.log(userInfo, userWithPlainPassword);

//       useAuthStore.getState().setUser(userWithPlainPassword);
//       localStorage.setItem("user", JSON.stringify(userWithPlainPassword));
//       //   localStorage.setItem("user", JSON.stringify(data[0]));
//       setUser(userWithPlainPassword);
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error("Invalid User");
//       console.error("Login error:", err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 min-h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6 w-full max-w-sm"
//       >
//         <h1 className="text-2xl font-bold text-center">Login</h1>
//         <Input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="autofill-black"
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="autofill-black"
//         />
//         <Button type="submit" className="w-full">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "../store/auth";
import toast from "react-hot-toast";
import logInLogo from "../assets/Login.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        return;
      }

      const userInfo = data[0];
      const userWithPlainPassword = { ...userInfo, password };
      console.log(userInfo, userWithPlainPassword);

      useAuthStore.getState().setUser(userWithPlainPassword);
      localStorage.setItem("user", JSON.stringify(userWithPlainPassword));
      setUser(userWithPlainPassword);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid User");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] flex justify-center items-center">
      <div className="flex justify-center items-center shadow-md max-h-[600px] rounded-lg px-10 py-20 border border-[#E6ECF0] bg-white">
        <img src={logInLogo} alt="login" />

        <div className="flex justify-center items-center min-h-screen text-[#004368]">
          <div className="space-x-5 p-10 rounded-2xl lg:w-[30vw] w-[90vw]">
            <div className="font-[400] text-[24px]">
              <p>Let's get started</p>
              <p>
                <strong>log in</strong> to your account
              </p>
            </div>

            <div className="pt-10">
              <form onSubmit={handleSubmit} className="space-y-8">
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
