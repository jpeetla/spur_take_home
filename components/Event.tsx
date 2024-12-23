export function designedEvent({ event }: { event: any }) {
  return (
    <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
      <p className="font-bold">{event.title}</p>
      <p className="text-sm">
        {event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {event.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
