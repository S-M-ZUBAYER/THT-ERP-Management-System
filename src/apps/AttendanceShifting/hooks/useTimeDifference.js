const useTimeDifference = (data) => {
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Convert minutes back to "HH:MM" format
  function minutesToTime(minutes) {
    const hours = String(Math.floor((minutes / 60) % 24)).padStart(2, "0"); // Use modulo 24 to handle overflow
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
  }

  // Find the lowest EntryTime
  const lowestEntryTime = Math.min(
    ...data.map((item) => timeToMinutes(item.EntryTime))
  );

  // Find the lowest ExitTime
  const lowestExitTime = Math.min(
    ...data.map((item) => timeToMinutes(item.ExitTime))
  );

  // Handle the case where ExitTime is before EntryTime (assuming it's the next day)
  let adjustedExitTime = lowestExitTime;
  let difference = lowestEntryTime - lowestExitTime;
  if (difference > 120) {
    adjustedExitTime = lowestExitTime + 60;
  } else {
    adjustedExitTime = difference / 2 + lowestExitTime;
  }
  // Convert back to time format
  const finalEntryTime = minutesToTime(lowestEntryTime);
  const finalExitTime = minutesToTime(adjustedExitTime);
  const lowestTime = minutesToTime(lowestExitTime);

  return { lowestTime, finalExitTime };
};

export default useTimeDifference;
