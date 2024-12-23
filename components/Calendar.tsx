import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSchedule } from "@/hooks/useSchedule";

const localizer = momentLocalizer(moment);

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

  return (
    <div>
      <Calendar
        key={events?.length ?? 0} // Force re-render when events are updated
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
        // components={{
        //   eventWrapper: ({ event }) => <CustomEventWrapper event={event} />,
        // }}
        eventPropGetter={(event) => ({
          style: {
            fontSize: "14px",
          },
        })}
      />
    </div>
  );
}
