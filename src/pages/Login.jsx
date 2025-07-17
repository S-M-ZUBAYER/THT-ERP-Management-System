import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "../store/auth";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        return; // Stay on login page
      }

      const userInfo = data[0];
      const userWithPlainPassword = { ...userInfo, password }; // correct!
      console.log(userInfo, userWithPlainPassword);

      useAuthStore.getState().setUser(userWithPlainPassword);
      localStorage.setItem("user", JSON.stringify(userWithPlainPassword));
      //   localStorage.setItem("user", JSON.stringify(data[0]));
      setUser(userWithPlainPassword);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid User");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
