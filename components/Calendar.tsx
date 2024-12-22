import React, { use, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CustomToolbar } from "@/components/CalendarToolbar";
import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";

const localizer = momentLocalizer(moment);

export function CustomCalendar() {
  const supabase = createClient();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function retrieveSchedule() {
      const { data: retrieveEvents } = await supabase.from("schedule").select();

      let allEvents = [];
      for (let i = 0; i < retrieveEvents.length; i++) {
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

      console.log(allEvents);
      setEvents(allEvents);
    }

    retrieveSchedule();
  }, []);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      components={{ toolbar: CustomToolbar }}
      style={{ height: "100%", width: "100%" }}
      className="border rounded-lg"
    />
  );
}
