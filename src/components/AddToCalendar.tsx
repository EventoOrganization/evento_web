"use client";
import { EventType } from "@/types/EventType";

type AddToCalendarProps = {
  event: EventType;
};

const AddToCalendar: React.FC<AddToCalendarProps> = ({ event }) => {
  const details = event?.details;

  // Vérification initiale pour retourner null si les détails de l'événement ou les dates sont manquants
  if (
    !details ||
    !details.date ||
    !details.endDate ||
    !details.startTime ||
    !details.endTime
  ) {
    console.warn("Missing event details:", details);
    return null;
  }

  const handleGoogleCalendar = () => {
    try {
      // Combine les dates et heures sans indiquer de fuseau horaire (UTC)
      const startDateTime = new Date(
        `${details.date?.split("T")[0]}T${details.startTime}`,
      );
      const endDateTime = new Date(
        `${details.endDate?.split("T")[0]}T${details.endTime}`,
      );

      console.log("Local Start DateTime:", startDateTime.toString());
      console.log("Local End DateTime:", endDateTime.toString());

      // Formater pour Google Calendar (YYYYMMDDTHHMMSS)
      const googleStartDateTime = startDateTime
        .toISOString()
        .replace(/-|:|\.\d+/g, "");
      const googleEndDateTime = endDateTime
        .toISOString()
        .replace(/-|:|\.\d+/g, "");

      console.log("Google Calendar Start DateTime:", googleStartDateTime);
      console.log("Google Calendar End DateTime:", googleEndDateTime);

      const title = encodeURIComponent(event.title || "Evento");
      const encodedDescription = encodeURIComponent(details.description || "");
      const encodedLocation = encodeURIComponent(details.location || "");

      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleStartDateTime}/${googleEndDateTime}&details=${encodedDescription}&location=${encodedLocation}&sf=true&output=xml`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error while converting date/time:", error);
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleGoogleCalendar}
        className=" py-2 text-blue-500 rounded-md hover:text-blue-600"
      >
        Add to Google Calendar
      </button>
    </div>
  );
};

export default AddToCalendar;
