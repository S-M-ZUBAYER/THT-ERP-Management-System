import { useState, useEffect } from "react";
import { useScheduleContext } from "../context/useSchedule";
import useCalculateShift from "../hooks/useCalculateShifts";
import useShiftInfo from "../hooks/useShiftInfo";
import useTimeDifference from "../hooks/useTimeDifference";
import { Clock4 } from "lucide-react";
import { OctagonAlert } from "lucide-react";
const CommonShiftTimes = ({ data, t }) => {
  const { setExitTime, setCalculateExitTime, setShowShiftInfo } =
    useScheduleContext();
  const [shiftingLength, setShiftingLength] = useState(1);

  const shifting = useCalculateShift(data);
  const { lowestTime, finalExitTime } = useTimeDifference(data);
  const hasInvalidShift = useShiftInfo(shifting);

  useEffect(() => {
    setShiftingLength(shifting?.length || 0);
    setExitTime(lowestTime);
    setCalculateExitTime(finalExitTime);
    setShowShiftInfo(hasInvalidShift);
  }, [
    shifting,
    lowestTime,
    finalExitTime,
    hasInvalidShift,
    setExitTime,
    setCalculateExitTime,
    setShowShiftInfo,
  ]);

  return (
    <div className="px-10 my-4">
      <span className="flex gap-2 items-center">
        <div className="w-10 h-10 flex justify-center items-center rounded-md bg-[#0043681A] ">
          <Clock4 />
        </div>
        <h2 className="text-[16px] font-bold text-[#010B13] ">
          {t("Common Shift Times")}{" "}
        </h2>
      </span>
      <ul>
        {shifting.map((time, index) => (
          <li
            key={index}
            className="lg:flex block justify-between items-center"
          >
            <p
              className={`${
                time.EntryTime === time.ExitTime && "text-red-500"
              } text-[#4A4A4A]  `}
            >
              {t("Shift")} {index + 1}: {time.EntryTime} - {time.ExitTime}
            </p>
            {time.EntryTime === time.ExitTime && (
              <p className="bg-[#FFABA8] lg:w-auto w-auto px-1 rounded-md">
                {t("Logically it's not Possible")}
              </p>
            )}
          </li>
        ))}
      </ul>

      {shiftingLength >= 4 && (
        <div className="w-full flex justify-center items-center h-[20vh] ">
          <div className="  h-[100%] flex justify-center items-center rounded-lg ">
            <span className="text-[12px] font-bold bg-[#FFABA8] px-5 py-2 rounded-md flex gap-2 items-center ">
              <OctagonAlert />
              <p> {t("note 2")} </p>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonShiftTimes;
