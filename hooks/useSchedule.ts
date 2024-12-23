import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";
import { formatDateTime } from "@/utils/convertDateTime";

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
    const formattedDate = formatDateTime(dtstart);
    const rrule = event.rRule;

    const fullRule = `DTSTART:${formattedDate}\n${rrule};COUNT=20;WKST=0`;
    let rule = RRule.fromString(fullRule);
    rule.options.tzid = "UTC";
    console.log("rule", rule.options.dtstart);

    const recurringEvents = rule.all().map((date) => ({
      ...event,
      start: new Date(date),
      end: new Date(date.getTime() + 60 * 60 * 1000),
    }));

    allEvents = [...allEvents, ...recurringEvents];
  }

  return allEvents;
};
