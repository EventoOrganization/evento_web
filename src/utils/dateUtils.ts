export const renderDate = (event: any) => {
  if (!event || !event.details) return null;

  const startDate = event.details.date;
  const endDate = event.details.endDate;

  const formatDate = (
    dateString: string,
    includeYear = false,
    fullMonth = false,
  ) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: fullMonth ? "long" : "short",
      day: "numeric",
      ...(includeYear && { year: "numeric" }),
    };
    return date.toLocaleDateString("en-UK", options);
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UK", { month: "long", year: "numeric" });
  };

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if the start and end dates are the same
  if (start.getTime() === end.getTime()) {
    return `${formatDate(startDate, true, true)}`; // ex: The 9 January 2025
  }

  // Check if start and end dates are in the same month and year
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `From ${start.getDate()} to ${end.getDate()} ${formatMonthYear(startDate)}`;
  }

  // Check if start and end dates are in the same year but different months
  if (start.getFullYear() === end.getFullYear()) {
    return `From ${formatDate(startDate)} to ${formatDate(endDate, true)}`;
  }

  // Different years
  return `From ${formatDate(startDate, true)} to ${formatDate(endDate, true)}`;
};
