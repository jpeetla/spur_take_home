import moment from "moment";

export function handleNavigate(currentDate: Date, action: string): Date {
  let newDate = new Date(currentDate);
  if (action === "NEXT") {
    newDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
  } else if (action === "PREV") {
    newDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
  } else if (action === "TODAY") {
    newDate = new Date();
  }
  return newDate;
}

export function getLabel(currentDate: Date): string {
  const startOfWeek = moment(currentDate).startOf("week").format("MMMM DD");
  const endOfWeek = moment(currentDate).endOf("week").format("MMMM DD");
  return `${startOfWeek} – ${endOfWeek}`;
}
