import { createClient } from "@/utils/supabase/client";
import { generateRecurringEvents } from "@/utils/generateRecurringEvents";

const supabase = createClient();

export const fetchSchedule = async () => {
  const { data: retrieveEvents, error } = await supabase
    .from("schedule")
    .select();

  if (error) throw new Error(error.message);

  let allEvents: any[] = [];
  for (let i = 0; retrieveEvents && i < retrieveEvents.length; i++) {
    const event = retrieveEvents[i];
    const dtstart = new Date(event.start);

    const byWeekday = event.rRule
      .split("BYDAY=")[1]
      .split(",")
      .map((day: any) => {
        switch (day) {
          case "MO":
            return 1;
          case "TU":
            return 2;
          case "WE":
            return 3;
          case "TH":
            return 4;
          case "FR":
            return 5;
          case "SA":
            return 6;
          case "SU":
            return 0;
          default:
            return null;
        }
      })
      .filter((day: null) => day !== null);

    const rruleOptions = {
      dtstart: dtstart,
      interval: 1,
      byweekday: byWeekday,
      count: 30,
      until: event.until ? new Date(event.until) : null,
    };

    const recurringDates = generateRecurringEvents(rruleOptions).map(
      (date) => ({
        ...event,
        start: new Date(date),
        end: new Date(date.getTime() + 60 * 60 * 1000),
      })
    );

    allEvents = [...allEvents, ...recurringDates];
  }

  return allEvents;
};
