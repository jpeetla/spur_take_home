import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createClient } from "@/utils/supabase/client";
import { RRule } from "rrule";
import { designedEvent } from "@/components/Event";

const localizer = momentLocalizer(moment);

export function CustomEventWrapper({ event }: { event: any }) {
  const eventDurationHours =
    (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
  const heightPercentage = (eventDurationHours / 24) * 100;

  const startTimeOffsetHours =
    event.start.getHours() + event.start.getMinutes() / 60;
  const topOffsetPercentage = (startTimeOffsetHours / 24) * 100;

  return (
    <div
      style={{
        position: "absolute",
        top: `${topOffsetPercentage}%`,
        height: `${heightPercentage}%`,
        backgroundColor: "#E5EDFB",
        border: "1px solid #93C5FD",
        color: "#1E40AF",
        borderRadius: "6px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        textAlign: "center",
        overflow: "hidden",
        whiteSpace: "normal",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{event.title}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "0.9rem",
          color: "#2563EB",
        }}
      >
        <span style={{ marginRight: "4px" }}>⏰</span>
        {event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })}
      </div>
    </div>
  );
}

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
        toolbar={false}
        style={{ height: "100%", width: "100%" }}
        className="border rounded-lg"
        components={{
          eventWrapper: ({ event }) => <CustomEventWrapper event={event} />, // Full custom event rendering
        }}
      />
    </div>
  );
}
