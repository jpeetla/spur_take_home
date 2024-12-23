export const generateRecurringEvents = (options: {
  dtstart: any;
  interval: any;
  byweekday: any;
  count: any;
  until: any;
}) => {
  const { dtstart, interval = 1, byweekday, count, until } = options;
  let current = new Date(dtstart);
  const occurrences = [];
  let iteration = 0;
  const maxIterations = 10000;

  const addDays = (date: string | number | Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getNextWeekday = (baseDate: Date, targetWeekday: number) => {
    const result = new Date(baseDate);
    const dayDiff = (targetWeekday - baseDate.getDay() + 7) % 7;
    result.setDate(baseDate.getDate() + dayDiff);
    return result;
  };

  while (true) {
    if (iteration > maxIterations) {
      throw new Error(
        "Infinite loop detected in customAll recurrence calculation"
      );
    }
    if (count && occurrences.length >= count) break;
    if (until && current > until) break;

    if (byweekday && byweekday.length > 0) {
      const weekStart = new Date(current);
      for (const day of byweekday) {
        const eventDate = getNextWeekday(weekStart, day);
        if (eventDate >= dtstart && (!until || eventDate <= until)) {
          occurrences.push(new Date(eventDate));
          if (count && occurrences.length >= count) break;
        }
      }
      current = addDays(current, interval * 7);
    }

    iteration++;
  }

  return occurrences.sort((a, b) => a.getTime() - b.getTime()); // Ensure dates are sorted
};
