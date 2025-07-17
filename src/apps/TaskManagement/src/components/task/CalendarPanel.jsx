import React, { useState } from "react";

export const CalendarPanel = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get the days of the week and calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)

    const days = [];
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    // Pad the rest of the grid
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const days = getCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  // Navigate to previous/next month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Handle day click to select a date
  const handleDayClick = (day) => {
    if (day) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setSelectedDate(newDate);
    }
  };

  // Highlight today's date
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-lg border border-[#E6ECF0] ">
      <div className="flex justify-between items-center mb-4 p-3 pr-6 ">
        <div
          onClick={prevMonth}
          className="px-4 py-1 text-gray-600 hover:text-gray-800  border-[#004368]  rounded-md"
        >
          &lt;
        </div>
        <h2 className="text-lg font-semibold text-[#004368] ">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div
          onClick={nextMonth}
          className="px-4 py-1 text-gray-600 hover:text-gray-800    rounded-md"
        >
          &gt;
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center px-4">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center text-sm text-center font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-[#BFBFBF] ${
              day ? "cursor-pointer" : "text-gray-300"
            } ${isToday(day) ? "bg-[#004368] text-white" : ""} ${
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentDate.getMonth() &&
              selectedDate.getFullYear() === currentDate.getFullYear()
                ? ""
                : ""
            }`}
            disabled={!day}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};
