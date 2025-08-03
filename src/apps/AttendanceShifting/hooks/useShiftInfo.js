const useShiftInfo = (shifting) => {
  const parseTimeToUTC = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.getTime(); // Returns the time in milliseconds (UTC timestamp)
  };
  const hasInvalidShift = shifting.some(
    ({ EntryTime, ExitTime }) =>
      parseTimeToUTC(EntryTime) > parseTimeToUTC(ExitTime)
  );

  return hasInvalidShift;
};

export default useShiftInfo;
