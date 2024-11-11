import { TimeSlotType } from "@/types/EventType";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/**
 * Génère les options d'heures avec intervalles de 15 minutes
 */
export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 15, 30, 45]) {
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

/**
 * Génère une plage de dates entre deux dates.
 */
export const generateDateRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

/**
 * Vérifie si deux dates sont identiques (format yyyy-MM-dd).
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Format a date in a specific timezone
 */
export const formatDateInTimeZone = (
  date: Date | string | undefined,
  timeZone: string,
  formatString = "yyyy-MM-dd HH:mm",
): string => {
  console.log("formatDateInTimeZone", date, "**", timeZone, "**", formatString);

  // Vérifier si la date est fournie
  if (!date) {
    console.warn("No date provided");
    return "";
  }

  // Si la date est une chaîne, essayez de la convertir en Date
  let parsedDate: Date;
  if (typeof date === "string") {
    parsedDate = new Date(date);
    // Si `new Date()` échoue, essayez d'ajouter un décalage horaire explicite
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(date + "T00:00:00");
    }
  } else {
    parsedDate = date;
  }

  // Vérifie si la date est valide après le parsing
  if (isNaN(parsedDate.getTime())) {
    console.warn("Invalid Date object:", date);
    return "";
  }

  // Utiliser `formatInTimeZone` si la date est valide
  return formatInTimeZone(parsedDate, timeZone, formatString);
};

/**
 * Met à jour les créneaux horaires en fonction des dates sélectionnées et du fuseau horaire.
 */
export const updateTimeSlots = (
  useMultipleTimes: boolean,
  localStartDate: string,
  localEndDate: string,
  localStartTime: string,
  localEndTime: string,
): TimeSlotType[] => {
  if (useMultipleTimes && localStartDate && localEndDate) {
    const dateRange = generateDateRange(localStartDate, localEndDate);
    return dateRange.map((date) => ({
      date,
      startTime: localStartTime || "08:00",
      endTime: localEndTime || "18:00",
    }));
  }
  return [];
};

/**
 * Gère le rendu des dates pour un événement.
 */
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

  if (start.getTime() === end.getTime()) {
    return `${formatDate(startDate, true, true)}`;
  }

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `From ${start.getDate()} to ${end.getDate()} ${formatMonthYear(startDate)}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `From ${formatDate(startDate)} to ${formatDate(endDate, true)}`;
  }

  return `From ${formatDate(startDate, true)} to ${formatDate(endDate, true)}`;
};

export const setDateWithTime = (
  dateString: string,
  timeString: string | undefined,
  isEndDate = false,
) => {
  const date = new Date(dateString);
  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  } else {
    // Si aucune heure n'est définie, utilisez 00:00:00 pour startDate ou 23:59:59 pour endDate
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
  }
  return date.toISOString();
};
