import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchSchedule } from "@/hooks/useSchedule";

const localizer = momentLocalizer(moment);

export function CustomCalendar({
  currentDate,
  setCurrentDate,
  needsRefresh,
  setNeedsRefresh,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  needsRefresh: boolean;
  setNeedsRefresh: (refresh: boolean) => void;
}) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (needsRefresh) {
      fetchSchedule().then((events) => {
        setEvents(events);
      });
      setNeedsRefresh(false);
    }
  }, [needsRefresh, setNeedsRefresh]);

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
        eventPropGetter={(event) => ({
          style: {
            fontSize: "14px",
            backgroundColor: "lavender",
            color: "blue",
            borderColor: "blue",
          },
        })}
      />
    </div>
  );
}
