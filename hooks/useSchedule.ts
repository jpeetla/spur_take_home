import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";

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

    const rule = RRule.fromString(event.rRule);
    const byWeekday = event.rRule
      .split("BYDAY=")[1]
      .split(",")
      .map((day: string) => {
        const isAMorPM = (dtstart: Date): string => {
          return dtstart.getHours() < 12 ? "AM" : "PM";
        };

        const adjustment = isAMorPM(dtstart) === "PM" ? 1 : 0;

        switch (day) {
          case "MO":
            return 0 + adjustment;
          case "TU":
            return 1 + adjustment;
          case "WE":
            return 2 + adjustment;
          case "TH":
            return 3 + adjustment;
          case "FR":
            return 4 + adjustment;
          case "SA":
            return 5 + adjustment;
          case "SU":
            return 6 + adjustment;
          default:
            return null;
        }
      });

    const updatedRule = new RRule({
      // ...rule.origOptions,
      dtstart,
      count: 20,
      // byweekday: rule.origOptions.byweekday || [dtstart.getDay()], // Ensure weekday matches dtstart
      byweekday: byWeekday,
    });

    console.log("dtstart", dtstart.getDay());

    const recurringEvents = updatedRule.all().map((date) => ({
      ...event,
      start: new Date(date),
      end: new Date(date.getTime() + 60 * 60 * 1000),
    }));
    allEvents = [...allEvents, ...recurringEvents];
  }

  return allEvents;
};
