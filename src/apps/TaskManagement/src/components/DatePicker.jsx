import React from "react";
// import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
// import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Calendar } from "./ui/calendar";

function DatePicker({ form, label, name = "date" }) {
  const selectedDate = form.watch(name);
  const error = form.formState.errors[name];

  return (
    <div>
      <label htmlFor={name} className="block font-medium text-gray-700">
        {label || "Select Date"}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <div
            id={name}
            className={cn(
              "w-full mt-1 p-2 border border-[#B0C5D0] rounded-md flex items-center justify-between text-left focus:ring-2 focus:ring-[#004368] focus:border-[#004368] cursor-pointer"
            )}
          >
            <span className="text-[#004368] ">
              {selectedDate
                ? format(selectedDate, "dd MMM yyyy")
                : "Pick a date"}
            </span>
            <CalendarIcon
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[9999] bg-white rounded-md shadow-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => {
              value && form.setValue(name, value, { shouldValidate: true });
            }}
            initialFocus
            className="bg-white rounded-md shadow-lg p-4"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

export default DatePicker;
