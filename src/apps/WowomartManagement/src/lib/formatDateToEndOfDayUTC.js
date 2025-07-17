const formatDateToEndOfDayUTC = (date) => {
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}T23:59:59Z`;
};

export default formatDateToEndOfDayUTC;
