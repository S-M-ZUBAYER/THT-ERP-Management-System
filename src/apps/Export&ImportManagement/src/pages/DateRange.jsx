import { addDays, format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";

const DateRanges = () => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="calendarWrap mt-8 grid place-items-center">
      <div>
        <input
          value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
            range[0].endDate,
            "MM/dd/yyyy"
          )}`}
          readOnly
          className="inputBox border-2 border-indigo-600 p-2 w-[225px] rounded"
          onClick={() => setOpen((open) => !open)}
        />
        <div ref={refOne}>
          {open && (
            <DateRange
              onChange={(item) => setRange([item.selection])}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={1}
              direction="horizontal"
              className="calendarElement"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRanges;
