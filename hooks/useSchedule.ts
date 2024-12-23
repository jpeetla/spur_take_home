import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";

const supabase = createClient();

const fetchSchedule = async () => {
  const { data: retrieveEvents, error } = await supabase
    .from("schedule")
    .select();

  if (error) throw new Error(error.message);

  let allEvents: any[] = [];
  for (let i = 0; retrieveEvents && i < retrieveEvents.length; i++) {
    const event = retrieveEvents[i];
    const dtstart = new Date(event.start);
    const rule = RRule.fromString(event.rRule);
    const updatedRule = new RRule({
      ...rule.origOptions,
      dtstart,
      count: 100,
    });

    const recurringEvents = updatedRule.all().map((date) => ({
      ...event,
      start: new Date(date),
      end: new Date(date.getTime() + 60 * 60 * 1000),
    }));
    allEvents = [...allEvents, ...recurringEvents];
  }

  return allEvents;
};

export const useSchedule = () => {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
    staleTime: 1000 * 60 * 5,
  });
};
