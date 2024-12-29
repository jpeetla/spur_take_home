import { SupabaseClient } from "@supabase/supabase-js";

interface saveEventProps {
  supabase: SupabaseClient;
  router: any;
  dateTime: string;
  selectedDays: string[];
  selectedTestSuite: string;
}

export async function saveEvent({
  supabase,
  router,
  dateTime,
  selectedDays,
  selectedTestSuite,
}: saveEventProps) {
  const startDateObject = new Date(dateTime);
  const endDateObject = new Date(startDateObject.getTime() + 60 * 60 * 1000);
  const formattedDays = selectedDays
    .map((day) => day.toUpperCase().slice(0, 2))
    .join(",");
  const formattedRule = `RRULE:FREQ=WEEKLY;BYDAY=${formattedDays}`;

  await supabase.from("schedule").insert([
    {
      title: selectedTestSuite,
      start: startDateObject.toISOString(),
      end: endDateObject.toISOString(),
      rRule: formattedRule,
    },
  ]);

  router.refresh();
}
