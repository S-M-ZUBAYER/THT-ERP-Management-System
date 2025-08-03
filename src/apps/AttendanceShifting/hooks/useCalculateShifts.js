const useCalculateShift = (shifts) => {
  function parseTimeToUTC(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return Date.UTC(2000, 0, 1, hours, minutes); // Ensures consistent time parsing
  }

  // Normalize shifts by adding 24 hours to exit times if they belong to the next day
  const normalizedShifts = shifts.map((shift) => {
    const entryTimeUTC = parseTimeToUTC(shift.EntryTime);
    const exitTimeUTC = parseTimeToUTC(shift.ExitTime);

    if (exitTimeUTC < entryTimeUTC) {
      return {
        EntryTime: shift.EntryTime,
        ExitTime: `${parseInt(shift.ExitTime.split(":")[0]) + 24}:${
          shift.ExitTime.split(":")[1]
        }`,
        isNextDay: true,
      };
    }

    return {
      ...shift,
      isNextDay: false,
    };
  });

  // Sort entry and exit times using UTC values
  const entryTimes = [...normalizedShifts]
    .sort((a, b) => parseTimeToUTC(a.EntryTime) - parseTimeToUTC(b.EntryTime))
    .map((team) => team.EntryTime);

  const exitTimes = [...normalizedShifts]
    .sort((a, b) => parseTimeToUTC(a.ExitTime) - parseTimeToUTC(b.ExitTime))
    .map((team) => team.ExitTime);

  const shift = [];
  let currentExitTime = null;
  let availableEntryTimes = [...entryTimes];
  let availableExitTimes = [...exitTimes];
  let isNextDayMap = Object.fromEntries(
    normalizedShifts.map((s) => [s.ExitTime, s.isNextDay])
  );

  while (availableExitTimes.length > 0) {
    let nextExitTime = availableExitTimes[0];

    let possibleEntryTimes = availableEntryTimes.filter(
      (time) => parseTimeToUTC(time) <= parseTimeToUTC(nextExitTime)
    );

    if (possibleEntryTimes.length === 0) {
      availableExitTimes.shift();
      continue;
    }

    let matchingEntryTime = possibleEntryTimes.pop();

    if (
      !currentExitTime ||
      parseTimeToUTC(matchingEntryTime) > parseTimeToUTC(currentExitTime)
    ) {
      let displayExitTime = nextExitTime;
      if (isNextDayMap[nextExitTime]) {
        const [hours, minutes] = nextExitTime.split(":");
        displayExitTime = `${parseInt(hours) - 24}:${minutes}`;
      }

      shift.push({
        EntryTime: matchingEntryTime,
        ExitTime: displayExitTime,
      });

      currentExitTime = nextExitTime;
      availableEntryTimes = availableEntryTimes.filter(
        (time) => time !== matchingEntryTime
      );
      availableExitTimes.shift();
    } else {
      availableExitTimes.shift();
    }
  }

  return shift;
};

export default useCalculateShift;
