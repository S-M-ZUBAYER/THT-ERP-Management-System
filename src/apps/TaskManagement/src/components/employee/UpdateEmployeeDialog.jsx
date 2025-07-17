// UpdateEmployeeDialog.jsx
import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
// import icons from "@/constants/icons";
// import { axiosApi } from "@/lib/axiosApi";
import { format } from "date-fns";
// import { useEmployeeData } from "@/hook/useEmployeeData";
import DatePicker from "../DatePicker";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import { Button } from "@/components/ui/button";
import { useEmployeeData } from "../../hook/useEmployeeData";

// zod schema
const updateEmployeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  designation: z.string().min(1, "Designation is required"),
  joiningDate: z.date({ required_error: "Joining date is required" }),
  image: z.any().optional(),
});

export const UpdateEmployeeDialog = forwardRef(({ employee }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(employee?.image || null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData } = useEmployeeData();

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      name: employee?.name || "",
      phone: employee?.phone || "",
      designation: employee?.designation || "",
      joiningDate: employee?.joiningDate
        ? new Date(employee.joiningDate)
        : new Date(),
      image: null,
    },
  });

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("image", file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("designation", data.designation);
      formData.append("joiningDate", format(data.joiningDate, "yyyy-MM-dd"));
      formData.append("role", employee.role);
      formData.append("id", employee.id);
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axiosApi.post("/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Employee updated successfully");
        setIsOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        key="dialog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-transparent backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg relative shadow-2xl"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Image upload */}
            <div className="flex justify-center">
              <label className="w-32 h-32 border border-dashed rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <img src={icons.Img} className="w-6 h-6" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label>Name</label>
              <input
                {...register("name")}
                className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] autofill-blue "
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label>Email</label>
              <input
                value={employee.email}
                readOnly
                className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] autofill-blue "
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                {...register("phone")}
                className="border border-[#d8d4d4ee] rounded py-1.5 px-0.5 w-full outline-none text-[#004368] autofill-blue "
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label>Designation</label>
              <Select
                defaultValue={employee.designation}
                onValueChange={(val) =>
                  setValue("designation", val, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  style={{
                    backgroundColor: "white",
                    outline: "none",
                    color: "#004368",
                  }}
                >
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software Engineer">
                    Software Engineer
                  </SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
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

            <div>
              <DatePicker
                form={{ watch, setValue, formState: { errors } }}
                label="Joining Date"
                name="joiningDate"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              style={{
                backgroundColor: "#004368",
                outline: "none",
                color: "white",
              }}
            >
              {isLoading ? "Updating..." : "Update Employee"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});
