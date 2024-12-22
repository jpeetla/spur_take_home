import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";

const localizer = momentLocalizer(moment);

export function CustomCalendar({
  currentDate,
  setCurrentDate,
  currentView,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  currentView: string;
}) {
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
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={currentView}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        onView={(view) => setCurrentView(view)}
        components={{
          timeGutterHeader: () => null,
          timeGutter: () => null,
        }}
        toolbar={false}
        style={{ height: "100%", width: "100%" }}
        className="border rounded-lg"
      />
    </div>
  );
}
