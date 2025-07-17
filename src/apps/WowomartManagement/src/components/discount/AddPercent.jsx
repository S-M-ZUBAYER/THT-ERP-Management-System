import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const formSchema = z.object({
  percent: z
    .number({
      required_error: "Percent is required",
      invalid_type_error: "Must be a number",
    })
    .min(2, { message: "Percent must be at least 2" }),
});

export function AddPercent({ onSuccess }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percent: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://grozziie.zjweiting.com:57683/tht/wowomart/api/discountPercent/create",
        {
          value: data.percent,
          label: `${data.percent}%`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage({
          type: "success",
          text: `✅ "${data.percent}%" created successfully!`,
        });
        onSuccess();
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Create percent error:", error);
      setMessage({
        type: "error",
        text: "❌ Something went wrong. Please retry.",
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-start gap-2 md:gap-4 w-full md:w-[30vw] h-auto md:h-[10vh]"
      >
        <div className="w-full">
          <label className="block font-bold mb-1 text-[#004368]">
            Add Percent
          </label>
          <input
            type="number"
            step="any"
            {...register("percent", { valueAsNumber: true })}
            placeholder="Enter percent"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          {errors.percent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.percent.message}
            </p>
          )}
        </div>
        <div className="pt-2 md:pt-6 w-full md:w-auto">
          <button
            type="submit"
            className="w-full md:w-auto text-white px-4 py-2 rounded hover:bg-gray-800"
            style={{ backgroundColor: "#004368" }}
          >
            Add
          </button>
        </div>
      </form>

      {message.text && (
        <p
          className={`text-sm mt-1 ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
