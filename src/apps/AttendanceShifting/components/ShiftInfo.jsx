import React from "react";
import { useScheduleContext } from "../context/useSchedule";

const ShiftInfo = ({ t }) => {
  const { showShiftInfo } = useScheduleContext();
  return (
    <div
      className={`   max-w-4xl mx-auto px-4 py-6 rounded-xl my-3 shadow-2xl ${
        showShiftInfo ? "block" : "hidden"
      }`}
    >
      <h2 className="lg:text-2xl text-[16px] font-[336] text-[#FF0800] mb-4">
        {t("note headline")}
      </h2>
      <p className="lg:text-sm text-[12px]  leading-relaxed text-[#FF8581] ">
        {t("note")}
      </p>
    </div>
  );
};

export default ShiftInfo;
