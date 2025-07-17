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
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signin() {
  const [loading, setLoading] = useState(false);

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
        "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      console.log(data.user);

      if (res.ok && !data.error) {
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful");
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      // Use toast to display the error message
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" flex justify-center items-center  text-[#004368] ">
      <div className=" space-x-5 p-10 rounded-2xl lg:w-[30vw] w-[90vw]">
        <h1 className="lg:text-[3vw] text-[5vw] font-bold ">Log In</h1>
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

              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#004368" }}
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
        <div className="mt-10">
          <NavLink to={"/sign-up"}>{"Don't"} have an account?</NavLink>
        </div>
      </div>
    </div>
  );
}
