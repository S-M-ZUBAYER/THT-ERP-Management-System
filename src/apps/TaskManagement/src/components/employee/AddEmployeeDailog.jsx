import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
// import icons from "@/constants/icons";
// import { axiosApi } from "@/lib/axiosApi";
import toast from "react-hot-toast";
// import { useEmployeeData } from "@/hook/useEmployeeData";
import DatePicker from "../DatePicker";
// import { useWebSocket } from "@/hook/useWebSocket";
import { useUserData } from "../../hook/useUserData";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import { useWebSocket } from "../../hook/useWebSocket";
import { useEmployeeData } from "../../hook/useEmployeeData";

const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(1, "Designation is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  joiningDate: z.date({ required_error: "Joining date is required" }),
  image: z.any().optional(),
});

export function AddEmployeeDailog() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData } = useEmployeeData();
  const { sendMessage } = useWebSocket();
  const { user } = useUserData();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      image: null,
      designation: "",
      joiningDate: new Date(),
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("designation", data.designation);
      formData.append("joiningDate", format(data.joiningDate, "yyyy-MM-dd"));
      formData.append("role", "User");

      if (data.image) {
        formData.append("image", data.image);
      }
      const res = await axiosApi.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Employee added successfully");
        try {
          sendMessage({
            type: "notify_admins",
            message: `New Employee added: ${data.name}`,
            name: user.name.trim(),
            date: format(new Date(), "MM-dd-yyyy"),
            path: "/employees",
          });
        } catch (error) {
          console.error("Error updating bug status:", error);
          toast.error(
            error.response?.data?.message ||
              "Failed to notify employee addition"
          );
        }
        setIsOpen(false);
        fetchData();
        reset();
        setPreview(null);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setValue("image", file);
        setPreview(URL.createObjectURL(file));
      } catch (err) {
        console.error("Error converting image:", err);
        toast.error("Failed to load image");
      }
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="hover:bg-[#004368] border-[1.5px] border-[#004368] text-[#004368] h-[44px] w-[300px] transition-all hover:text-white flex justify-center items-center rounded-sm font-bold cursor-pointer"
      >
        Add new Employee
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent backdrop-blur-sm bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative p-4 w-full max-w-[30vw]"
            >
              <div className="relative bg-[#FFFFFF] rounded-lg shadow dark:bg-gray-700 px-4">
                <div
                  onClick={() => setIsOpen(false)}
                  aria-label="Close dialog"
                  className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </div>

                <div className="rounded-2xl space-y-4">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 pb-8"
                  >
                    {/* Image Upload */}
                    <div className="flex justify-center pt-20">
                      <label className="w-40 h-40 border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-100">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img src={icons.Img} alt="imag" className="w-8 h-8" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee name
                      </label>
                      <input
                        {...register("name")}
                        className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 autofill-blue "
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee email
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 autofill-blue"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee Password
                      </label>
                      <input
                        type="password"
                        {...register("password")}
                        className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 autofill-blue"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee Phone Number
                      </label>
                      <input
                        type="text"
                        {...register("phone")}
                        className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] focus:border-blue-500 focus:ring-blue-500 autofill-blue"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Employee’s Designation
                      </label>
                      <Select
                        onValueChange={(val) =>
                          setValue("designation", val, { shouldValidate: true })
                        }
                        value={watch("designation") || ""}
                      >
                        <SelectTrigger
                          style={{
                            backgroundColor: "transparent",
                            outline: "none",
                            color: "#004368",
                            width: "100%",
                          }}
                        >
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: "white" }}>
                          <SelectItem value="Software Engineer">
                            Software Engineer
                          </SelectItem>
                          <SelectItem value="UI/UX Designer">
                            UI/UX Designer
                          </SelectItem>
                          <SelectItem value="Project Manager">
                            Project Manager
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.designation && (
                        <p className="text-sm text-red-500">
                          {errors.designation.message}
                        </p>
                      )}
                    </div>

                    {/* Joining Date */}
                    <div>
                      <DatePicker
                        form={{ watch, setValue, formState: { errors } }}
                        label="Joining Date"
                        name="joiningDate"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-900 text-white hover:bg-blue-800"
                      style={{ backgroundColor: "#004368", outline: "none" }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Employee"}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
