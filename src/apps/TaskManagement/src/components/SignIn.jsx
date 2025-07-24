import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await fetch(
        "https://grozziie.zjweiting.com:57683/tht/taskManagement/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      console.log(data.result);

      if (res.ok && !data.error) {
        localStorage.setItem("user", JSON.stringify(data.result));

        toast.success("Login successful");
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" flex justify-center items-center  text-[#004368] ">
      <div className=" space-x-5 p-10 rounded-2xl lg:w-[30vw] w-[90vw]">
        <div className="font-[400] text-[24px]">
          <p>Let’s get started</p>
          <p>
            <strong>log in</strong> to your account
          </p>
        </div>
        <div className="pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        className="text-black autofill-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="text-black pr-10 autofill-black"
                          {...field}
                        />
                      </FormControl>
                      <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </Form>
        </div>
      </div>
    </div>
  );
}
