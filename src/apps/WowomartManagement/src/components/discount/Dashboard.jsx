import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

import Datepicker from "./Datepicker";
import { Input } from "../../../../../components/ui/input";
import generateRandomCoupon from "../../lib/generateRandomCoupon";
import formatDateToYYYYMMDD from "../../lib/formatDateToYYYYMMDD";
import formatDateToEndOfDayUTC from "../../lib/formatDateToEndOfDayUTC";
import { Button } from "../../../../../components/ui/button";
// import formatDateToEndOfDayUTC from "@/lib/formatDateToEndOfDayUTC";
// import generateRandomCoupon from "@/lib/generateRandomCoupon";
// import formatDateToYYYYMMDD from "@/lib/formatDateToYYYYMMDD";

// === Schema Definition ===
const formSchema = z.object({
  segmentQuery: z.string().min(1),
  title: z.string().optional(),
  minimumItem: z
    .number()
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "Item must be a positive number",
    }),
  percentage: z.number().min(0.1, "Select a valid discount"),
  minimumAmount: z.number().optional(),
  expireDate: z.date().optional(),
  discountEnd: z.date().optional(),
});

// === Constants ===
const STATUS_OPTIONS = [
  {
    value: "customer_tags CONTAINS",
    label: "Equal Tag Name",
    ApiUrl:
      "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/segment-discount",
  },
  {
    value: "customer_added_date <= ",
    label: "Account Duration",
    ApiUrl:
      "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/segment-discount",
  },
  {
    value: "xxx",
    label: "Minimum Amount",
    ApiUrl:
      "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/create-discount",
  },
  {
    value: "XXX",
    label: "Minimum item",
    ApiUrl:
      "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/create-discount",
  },
];

function Dashboard({ percents }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segmentQuery: "",
      title: "",
      minimumItem: undefined,
      percentage: undefined,
      minimumAmount: undefined,
      expireDate: undefined,
      discountEnd: undefined,
    },
    mode: "onChange",
  });

  const segmentValue = form.watch("segmentQuery");

  const onSubmit = useCallback(
    async (values) => {
      const selectedOption = STATUS_OPTIONS.find(
        (option) => option.value === values.segmentQuery
      );

      if (!selectedOption) {
        setMessage({
          type: "error",
          text: "Invalid segment selected.",
        });
        return;
      }

      const { tag, code } = generateRandomCoupon();

      const payload = {
        ...values,
        code,
        discountEnd:
          values.segmentQuery === "customer_added_date <= "
            ? formatDateToYYYYMMDD(values.discountEnd)
            : undefined,
        tag: values.segmentQuery === "customer_tags CONTAINS" ? tag : undefined,
        expireDate: formatDateToEndOfDayUTC(values.expireDate),
      };
      console.log(payload);
      try {
        await axios.post(selectedOption.ApiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        setMessage({
          type: "success",
          text: `✅ Discount "${tag}" created successfully!`,
        });

        form.reset();
      } catch (error) {
        console.error("Submit error:", error);
        setMessage({
          type: "error",
          text: "❌ Something went wrong. Please retry.",
        });
      }
    },
    [form]
  );

  return (
    <div>
      <p className="text-3xl font-bold text-[#004368] border-b-1 border-[#90B4C8] mb-10">
        Coupon
      </p>

      <div className=" h-auto p-6 bg-white rounded-lg ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
          >
            {/* Segment Selector */}
            <FormField
              control={form.control}
              name="segmentQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#004368] font-semibold">
                    User Eligibility
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        style={{
                          backgroundColor: "white",
                          width: "100%",
                          fontFamily: "sans-serif",
                          color: "#004368",
                          fontSize: "15.5px",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      >
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-[#004368]"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#004368] font-semibold ">
                    Coupon Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter coupon title"
                      style={{
                        fontFamily: "sans-serif",
                        color: "#004368",
                        fontSize: "15.5px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Item Field */}
            {segmentValue === "XXX" && (
              <FormField
                control={form.control}
                name="minimumItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#004368] font-semibold ">
                      Minimum Items
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="Enter item number"
                        style={{
                          fontFamily: "sans-serif",
                          color: "#004368",
                          fontSize: "15.5px",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Minimum Amount Field */}
            {segmentValue === "xxx" && (
              <FormField
                control={form.control}
                name="minimumAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#004368] font-semibold ">
                      Minimum Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="Enter minimum amount"
                        style={{
                          fontFamily: "sans-serif",
                          color: "#004368",
                          fontSize: "15.5px",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* discount End Date */}
            {segmentValue === "customer_added_date <= " && (
              <FormField
                control={form.control}
                name="discountEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#004368] font-semibold">
                      Discount Eligibility Date
                    </FormLabel>
                    <Datepicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#004368] font-semibold w-full">
                    Expiration Date
                  </FormLabel>
                  <Datepicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Selector */}
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#004368] font-semibold">
                    Discount
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger
                        style={{
                          backgroundColor: "white",
                          outline: "none",
                          width: "100%",
                          fontFamily: "sans-serif",
                          color: "#004368",
                          boxShadow: "none",
                        }}
                      >
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {percents.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value.toString()}
                          className="text-[#004368] "
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Feedback */}
            {message.text && (
              <p
                className={`text-sm mt-1 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}
            <div></div>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-5"
              disabled={form.formState.isSubmitting}
              style={{ backgroundColor: "#004368", color: "white" }}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Dashboard;
