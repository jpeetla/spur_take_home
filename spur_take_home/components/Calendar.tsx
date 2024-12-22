import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CustomToolbar } from "@/components/CalendarToolbar";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Demo Suite",
    start: new Date(2024, 9, 10, 11, 0),
    end: new Date(2024, 9, 10, 12, 0),
  },
  {
    title: "Authentication",
    start: new Date(2024, 9, 11, 8, 0),
    end: new Date(2024, 9, 11, 9, 0),
  },
];

export function CustomCalendar() {
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      components={{ toolbar: CustomToolbar }}
      style={{ height: "100%" }}
      className="border rounded-lg"
    />
  );
}
