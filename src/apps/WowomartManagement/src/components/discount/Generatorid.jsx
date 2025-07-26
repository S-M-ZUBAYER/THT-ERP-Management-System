import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
// import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useCallback } from "react";
// import useStore from "@/zustand/inputValueStore";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import useStore from "../../zustand/inputValueStore";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const API_BASE_URL =
  "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/shopifyCustomerid";

function GeneratorId() {
  const { addInputValue } = useStore();
  const [message, setMessage] = useState({ type: "", text: "" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (values) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${values.email}`);
        const fetchedUserId = response.data.data.split("/").pop();

        if (!fetchedUserId) {
          throw new Error("No user ID found for this email");
        }

        addInputValue({ id: fetchedUserId, email: values.email });
        setMessage({ type: "success", text: "✅ Add Email successfully!" });
        form.reset();
      } catch (error) {
        console.error(error);
        setMessage({
          type: "error",
          text: "Something went wrong. Please retry.",
        });
      }
    },
    [form, addInputValue]
  );

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-[#004368] font-bold">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={form.formState.isSubmitting}
                    className="autofill-black"
                    style={{
                      backgroundColor: "transparent",
                      outline: "none",
                      color: "#004368",
                      boxShadow: "none",
                    }}
                  />
                </FormControl>
                {message.text && (
                  <p
                    className={`text-sm mt-1 ${
                      message.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            style={{ backgroundColor: "#004368", color: "white" }}
            className="mt-6 sm:mt-8"
          >
            {form.formState.isSubmitting ? "Fetching..." : "Add Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default GeneratorId;
