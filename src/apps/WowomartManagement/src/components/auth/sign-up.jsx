import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
    };

    try {
      const res = await fetch(
        "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(data.message || "Registered successfully");
      navigate("/log-in", { replace: true });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center text-[#004368] min-h-screen">
      <div className="space-x-5 p-10 rounded-2xl lg:w-[30vw] w-[90vw]">
        <h1 className="lg:text-[3vw] text-[6vw] font-bold">Sign-Up</h1>
        <div className="pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Full Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        className="text-black"
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
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Please confirm your password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                style={{ backgroundColor: "#004368" }}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign-Up"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-6">
          <NavLink
            to={"/log-in"}
            className="text-sm text-blue-600 hover:underline"
          >
            Already have an account?
          </NavLink>
        </div>
      </div>
    </div>
  );
}
