export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);

export const formatMachineDate = (date: Date): string =>
  date.toISOString().slice(0, 10);
