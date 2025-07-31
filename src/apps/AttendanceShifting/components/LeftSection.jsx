import image from "../constants/image";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendar } from "react-icons/fa";
import ShiftInfo from "./ShiftInfo";

const LeftSection = ({ t, form, setForm, submit }) => {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto  h-[350px]  ">
        {/* Header Section */}
        <div className="flex items-center gap-4 text-black font-semibold text-lg">
          <img src={image.people} className="w-10 h-10" alt="logo" />
          <p>{t("shift schedule")}</p>
        </div>

        {/* Form Section */}
        <div className="mt-6">
          {/* Team Name Input */}
          <div className="mb-4">
            <label className="block font-bold text-gray-700">
              {t("Team Name")}
            </label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 bg-transparent text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 shadow-sm"
              placeholder={t("Team Name")}
              value={form.teamName}
              onChange={(e) => setForm({ ...form, teamName: e.target.value })}
            />
          </div>

          {/* Entry & Exit Time Inputs */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Entry Time */}
            <div className="flex-1">
              <label className="block font-bold text-gray-700">
                {t("Entry Time")}
              </label>
              <input
                type="text"
                maxLength={"5"}
                className="w-full mt-1 px-3 py-2 bg-transparent text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 shadow-sm"
                placeholder="HH : MM"
                value={form.entry}
                onChange={(e) => setForm({ ...form, entry: e.target.value })}
              />
            </div>

            {/* Exit Time */}
            <div className="flex-1">
              <label className="block font-bold text-gray-700">
                {t("Exit Time")}
              </label>
              <input
                type="text"
                maxLength={"5"}
                className="w-full mt-1 px-3 py-2 bg-transparent text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 shadow-sm"
                placeholder="HH : MM"
                value={form.exit}
                onChange={(e) => setForm({ ...form, exit: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={submit}
            className="w-auto md:w-full bg-[#004368] text-white font-semibold px-6 py-2.5 rounded-lg transition hover:bg-[#00314e] shadow-md"
          >
            {t("Submit")}
          </button>
        </div>
      </div>
      <ShiftInfo t={t} />
      <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-xl mt-4">
        {/* Header with Icon */}
        <div className="flex items-center gap-2 text-xl font-semibold">
          <FaRegCalendar className="text-blue-600" />
          <span>
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Calendar */}
        <Calendar
          onChange={setDate}
          value={date}
          locale="en-US"
          next2Label={null} // Hide double navigation
          prev2Label={null}
          className="custom-calendar bg-black"
        />
      </div>
    </>
  );
};

export default LeftSection;
