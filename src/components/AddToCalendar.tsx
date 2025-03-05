"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EventType } from "@/types/EventType";
import { Briefcase, Calendar, Download, Globe, Mail } from "lucide-react";
import { Button } from "./ui/button";

type AddToCalendarProps = {
  event: EventType;
};

const AddToCalendar: React.FC<AddToCalendarProps> = ({ event }) => {
  const details = event?.details;
  const isPastEvent = new Date(details?.endDate || "") < new Date();

  if (!details || !details.date || !details.endDate || !details.startTime) {
    console.warn("Missing event details:", details);
    return null;
  }

  const { title = "Evento", description = "", location = "" } = event;
  const startDateTime = new Date(
    `${details.date.split("T")[0]}T${details.startTime}`,
  );

  const endDateTime = new Date(
    `${details.endDate.split("T")[0]}T${
      details.endTime || "23:59" // Par défaut à 23:59 si endTime est vide
    }`,
  );

  const formatDateForCalendar = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, "");

  const googleStartDateTime = formatDateForCalendar(startDateTime);
  const googleEndDateTime = formatDateForCalendar(endDateTime);

  const handleGoogleCalendar = () => {
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title,
    )}&dates=${googleStartDateTime}/${googleEndDateTime}&details=${encodeURIComponent(
      description,
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(url, "_blank");
  };

  const handleYahooCalendar = () => {
    const yahooStartDateTime = `${startDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}`;
    const yahooEndDateTime = `${endDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}`;
    const url = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(
      title,
    )}&st=${yahooStartDateTime}&et=${yahooEndDateTime}&desc=${encodeURIComponent(
      description,
    )}&in_loc=${encodeURIComponent(location)}`;
    window.open(url, "_blank");
  };

  const handleOutlookCalendar = () => {
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      title,
    )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(
      location,
    )}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&allday=false&path=/calendar/view/Month`;
    window.open(url, "_blank");
  };

  const downloadICS = () => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${formatDateForCalendar(startDateTime)}
DTEND:${formatDateForCalendar(endDateTime)}
END:VEVENT
END:VCALENDAR
`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (isPastEvent) return;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 py-2 text-blue-500 hover:text-blue-600">
          <Calendar size={20} />
          Add to Calendar
        </button>
      </DialogTrigger>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 p-6 bg-white rounded-md shadow-md w-[90%] max-w-2xl">
        <Button
          variant={"outline"}
          onClick={handleGoogleCalendar}
          className="flex items-center gap-2  text-blue-500"
        >
          <Globe size={24} />
          Google Calendar
        </Button>
        <Button
          variant={"outline"}
          onClick={handleYahooCalendar}
          className="flex items-center gap-2 text-purple-500"
        >
          <Mail size={24} />
          Yahoo Calendar
        </Button>
        <Button
          variant={"outline"}
          onClick={handleOutlookCalendar}
          className="flex items-center gap-2 text-blue-700"
        >
          <Briefcase size={24} />
          Outlook Calendar
        </Button>
        <Button
          variant={"outline"}
          onClick={downloadICS}
          className="flex items-center gap-2 text-green-500"
        >
          <Download size={24} />
          Download ICS
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendar;
