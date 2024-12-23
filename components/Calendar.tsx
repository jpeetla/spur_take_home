import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSchedule } from "@/hooks/useSchedule";

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
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) {
  const { data: events, isLoading, isError, error } = useSchedule();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (events?.length ?? 0 > 0) ? (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={"week"}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        toolbar={false}
        style={{ height: "100%", width: "100%" }}
        className="border rounded-lg"
        components={{
          eventWrapper: ({ event }) => <CustomEventWrapper event={event} />,
        }}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
}
