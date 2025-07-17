// components/ReportDateRangePicker.tsx
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export function ReportDateRangePicker({ onRangeSelect }) {
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedRange) => {
    setRange(selectedRange);
    onRangeSelect?.(selectedRange);
  };

  const displayRange =
    range.from && range.to
      ? `${format(range.from, "PPP")} → ${format(range.to, "PPP")}`
      : range.from
      ? `${format(range.from, "PPP")} → ...`
      : "Pick date range";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 14px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "white",
          cursor: "pointer",
          minWidth: 220,
          textAlign: "center",
          outline: "none",
        }}
      >
        {displayRange}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            marginTop: 8,
            right: 0,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: 6,
          }}
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
          <div
            style={{
              textAlign: "right",
              padding: "8px 12px",
              gap: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                backgroundColor: "#004368",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              onClick={() => {
                setRange({ from: undefined, to: undefined });
                onRangeSelect?.({ from: undefined, to: undefined });
              }}
            >
              reset range
            </button>
            <button
              style={{
                backgroundColor: "#004368",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              onClick={() => {
                setOpen(false);
                onRangeSelect?.(range);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
