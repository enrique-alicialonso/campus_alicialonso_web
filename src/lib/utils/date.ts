import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Add the plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Add this function before the ResourceSchedule component
export const isDateInSameWeek = (
  dateToCheck: string,
  referenceDate: string
): boolean => {
  const reference = dayjs(referenceDate);
  const check = dayjs(dateToCheck);

  // Get the start and end of the week for the reference date
  // Assuming weeks start on Monday (1) and end on Sunday (7)
  const startOfWeek = reference.startOf("week");
  const endOfWeek = reference.endOf("week");

  // Check if the date falls within the week
  return (
    check.isSameOrAfter(startOfWeek, "day") &&
    check.isSameOrBefore(endOfWeek, "day")
  );
};
