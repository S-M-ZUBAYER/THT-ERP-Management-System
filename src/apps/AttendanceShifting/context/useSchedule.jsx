import { createContext, useContext, useState } from "react";

const ScheduleContext = createContext();
export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("use Context problem ");
  }
  return context;
};

export const ScheduleProvider = ({ children }) => {
  const [showShiftInfo, setShowShiftInfo] = useState(false);
  const [exitTime, setExitTime] = useState();
  const [calculateExitTime, setCalculateExitTime] = useState();
  return (
    <ScheduleContext.Provider
      value={{
        showShiftInfo,
        setShowShiftInfo,
        exitTime,
        setExitTime,
        calculateExitTime,
        setCalculateExitTime,
      }}
    >
      {children}{" "}
    </ScheduleContext.Provider>
  );
};
