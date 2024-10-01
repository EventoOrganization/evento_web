import { EventType } from "@/types/EventType";
import React from "react";

type Props = {
  event?: EventType;
};

const EventTimeSlots: React.FC<Props> = ({ event }) => {
  // Helper function to format date and time
  const formatTimeSlot = (slot: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    // Parse the date and time as UTC and then convert to local time for display
    const date = new Date(slot.date);
    const startDate = new Date(
      `${slot.date.split("T")[0]}T${slot.startTime}:00Z`,
    ); // Ensure proper formatting
    const endDate = new Date(`${slot.date.split("T")[0]}T${slot.endTime}:00Z`); // Ensure proper formatting

    // Format options for date and time
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-UK", dateOptions);
    const startTime = startDate.toLocaleTimeString("en-UK", timeOptions);
    const endTime = endDate.toLocaleTimeString("en-UK", timeOptions);

    return `${formattedDate}\n${startTime} - ${endTime}`;
  };

  return (
    <div>
      {event?.details?.timeSlots && (
        <div>
          {event.details.timeSlots.map((slot, index) => (
            <React.Fragment key={index}>
              <div className="">{formatTimeSlot(slot)}</div>
              {index < (event.details?.timeSlots?.length ?? 0) - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTimeSlots;
