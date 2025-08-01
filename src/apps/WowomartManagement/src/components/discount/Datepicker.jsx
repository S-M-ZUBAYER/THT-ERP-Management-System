import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "../../../../../components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "../../../../../components/ui/calendar";

function Datepicker({ value, onChange, placeholder }) {
  return (
    <Popover>
      <PopoverTrigger
        asChild
        style={{ backgroundColor: "white", color: "#004368" }}
      >
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal bg-white text-[#004368] w-full",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 z-[1000]" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default Datepicker;
